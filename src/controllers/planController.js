// src/controllers/planController.js

const pool = require('../config/db');

/**
 * Fetches all necessary data for the Plan Control screen initialization.
 * This version is now fully permission-aware based on department membership.
 * - Superior Admins see all departments in the tenant.
 * - Other users (admins/managers) see ONLY the departments they are assigned to.**/
 // Replace the existing getPlanData function in src/controllers/planController.js with this one.

const getPlanData = async (req, res) => {
    const tenantId = req.user.tenant_id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { year } = req.query;
    const academicYear = year || new Date().getFullYear();
    
    try {
        let departmentsQuery;
        let queryParams = [tenantId];

        if (userRole === 'superior_admin') {
            departmentsQuery = 'SELECT id, name, description, color FROM departments WHERE tenant_id = ?';
        } else { 
            departmentsQuery = `
                SELECT d.id, d.name, d.description, d.color 
                FROM departments d JOIN department_members dm ON d.id = dm.department_id
                WHERE d.tenant_id = ? AND dm.user_id = ? AND dm.role IN ('admin', 'manager')
            `;
            queryParams.push(userId);
        }
        
        // Using the stable, sequential execution that is proven to work.
        const [departments] = await pool.query(departmentsQuery, queryParams);
        
        const usersQuery = "SELECT u.id, u.role, p.full_name, p.profile_image_url FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.tenant_id = ?";
        const [users] = await pool.query(usersQuery, [tenantId]);

        if (departments.length === 0) {
            return res.status(200).json({ success: true, data: { departments: [], plans: [], users } });
        }

        const departmentIds = departments.map(d => d.id);

        const [[members], [plans]] = await Promise.all([
             pool.query('SELECT dm.department_id, dm.user_id, dm.role, p.full_name, p.profile_image_url as avatarUrl FROM department_members dm JOIN users u ON dm.user_id = u.id JOIN profiles p ON u.id = p.user_id WHERE dm.department_id IN (?)', [departmentIds]),
             pool.query('SELECT * FROM plans WHERE department_id IN (?) AND academic_year = ?', [departmentIds, academicYear]),
        ]);
       
        const departmentMembersMap = new Map();
        for (const member of members) {
            if (!departmentMembersMap.has(member.department_id)) {
                departmentMembersMap.set(member.department_id, []);
            }
            departmentMembersMap.get(member.department_id).push({
                userId: member.user_id, role: member.role, name: member.full_name, avatarUrl: member.avatarUrl
            });
        }
        
        const processedDepartments = departments.map(dept => {
            return {
                ...dept, 
                members: departmentMembersMap.get(dept.id) || []
            };
        });

        res.status(200).json({
            success: true,
            data: { departments: processedDepartments, plans, users }
        });

    } catch (error) {
        // This is the only log we need - for actual errors.
        console.error("[Controller] CRITICAL ERROR in getPlanData:", error);
        res.status(500).json({ success: false, message: "Server error while fetching plan data." });
    }
};
const createDepartment = async (req, res) => {
    const { name, description, color } = req.body;
    const tenantId = req.user.tenant_id;
    if (!name || !color) {
        return res.status(400).json({ success: false, message: 'Name and color are required.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO departments (tenant_id, name, description, color) VALUES (?, ?, ?, ?)',
            [tenantId, name, description, color]
        );
        const [[newDept]] = await pool.query('SELECT * FROM departments WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: { ...newDept, members: [] } });
    } catch (error) {
        console.error("Error creating department:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const updateDepartment = async (req, res) => {
    const { deptId } = req.params;
    const { name, description, color } = req.body;
    const tenantId = req.user.tenant_id;

    if (!name || !color) {
        return res.status(400).json({ success: false, message: 'Name and color are required.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE departments SET name = ?, description = ?, color = ? WHERE id = ? AND tenant_id = ?',
            [name, description, color, deptId, tenantId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Department not found or access denied.' });
        }
        
        const [[updatedDept]] = await pool.query('SELECT * FROM departments WHERE id = ?', [deptId]);
        
        const [membersResult] = await pool.query('SELECT dm.user_id as userId, dm.role, p.full_name as name, p.profile_image_url as avatarUrl FROM department_members dm JOIN profiles p ON dm.user_id = p.user_id WHERE dm.department_id = ?', [deptId]);

        res.status(200).json({ success: true, data: { ...updatedDept, members: membersResult } });
    } catch (error) {
        console.error("Error updating department:", error);
        res.status(500).json({ success: false, message: "Server error while updating department." });
    }
};

const updateDepartmentMembers = async (req, res) => {
    const { deptId } = req.params;
    const { members } = req.body; 
    const tenantId = req.user.tenant_id;

    if (!Array.isArray(members)) {
        return res.status(400).json({ success: false, message: 'members must be an array.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [depts] = await connection.query('SELECT id FROM departments WHERE id = ? AND tenant_id = ?', [deptId, tenantId]);
        if (depts.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Department not found or access denied.' });
        }
        
        await connection.query('DELETE FROM department_members WHERE department_id = ?', [deptId]);
        
        if (members.length > 0) {
            const values = members.map(member => [deptId, member.userId, member.role]);
            await connection.query('INSERT INTO department_members (department_id, user_id, role) VALUES ?', [values]);
        }
        
        await connection.commit();
        res.status(200).json({ success: true, message: 'Department members updated successfully.' });
    } catch (error) {
        await connection.rollback();
        console.error("Error updating department members:", error);
        res.status(500).json({ success: false, message: "Server error." });
    } finally {
        connection.release();
    }
};

const deleteDepartment = async (req, res) => {
    const { deptId } = req.params;
    const tenantId = req.user.tenant_id;
    try {
        const [result] = await pool.query(
            'DELETE FROM departments WHERE id = ? AND tenant_id = ?',
            [deptId, tenantId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Department not found or you do not have permission.' });
        }
        res.status(200).json({ success: true, message: 'Department deleted successfully.' });
    } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const createPlan = async (req, res) => {
    const { title, description, planDate, assigneeId, departmentId, isHighPriority, isRecurring, academicYear } = req.body;
    const tenantId = req.user.tenant_id;
    if (!title || !departmentId || !academicYear) {
        return res.status(400).json({ success: false, message: 'Title, department, and academic year are required.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO plans (tenant_id, department_id, assignee_id, title, description, plan_date, is_high_priority, is_recurring, academic_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [tenantId, departmentId, assigneeId, title, description, planDate, isHighPriority || false, isRecurring || false, academicYear]
        );
        const [newPlan] = await pool.query('SELECT * FROM plans WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: newPlan[0] });
    } catch (error) {
        console.error("Error creating plan:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const updatePlan = async (req, res) => {
    const { planId } = req.params;
    const { title, description, planDate, assigneeId, departmentId, isDone, isHighPriority, isRecurring } = req.body;
    try {
        await pool.query(
            'UPDATE plans SET title = ?, description = ?, plan_date = ?, assignee_id = ?, department_id = ?, is_done = ?, is_high_priority = ?, is_recurring = ? WHERE id = ? AND tenant_id = ?',
            [title, description, planDate, assigneeId, departmentId, isDone, isHighPriority, isRecurring, planId, req.user.tenant_id]
        );
        const [updatedPlan] = await pool.query('SELECT * FROM plans WHERE id = ?', [planId]);
        res.status(200).json({ success: true, data: updatedPlan[0] });
    } catch (error) {
        console.error("Error updating plan:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const deletePlan = async (req, res) => {
    const { planId } = req.params;
    try {
        await pool.query('DELETE FROM plans WHERE id = ? AND tenant_id = ?', [planId, req.user.tenant_id]);
        res.status(200).json({ success: true, message: 'Plan deleted.' });
    } catch (error) {
        console.error("Error deleting plan:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const togglePlanStatus = async (req, res) => {
    const { planId } = req.params;
    const { isDone } = req.body;
    try {
        await pool.query(
            'UPDATE plans SET is_done = ? WHERE id = ? AND tenant_id = ?',
            [isDone, planId, req.user.tenant_id]
        );
        res.status(200).json({ success: true, message: 'Status updated.' });
    } catch(error) {
        console.error("Error toggling plan status:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const performAnnualRollover = async (req, res) => {
    const { sourceYear, destinationYear } = req.body;
    const tenantId = req.user.tenant_id;
    if (!sourceYear || !destinationYear) {
        return res.status(400).json({ success: false, message: "Source and destination years are required." });
    }
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [recurringPlans] = await connection.query(
            "SELECT * FROM plans WHERE academic_year = ? AND tenant_id = ? AND is_recurring = TRUE",
            [sourceYear, tenantId]
        );
        let copiedCount = 0;
        if (recurringPlans.length > 0) {
            for (const plan of recurringPlans) {
                const [existing] = await connection.query(
                    "SELECT id FROM plans WHERE academic_year = ? AND department_id = ? AND title = ?",
                    [destinationYear, plan.department_id, plan.title]
                );
                if (existing.length === 0) {
                    await connection.query(
                        `INSERT INTO plans (tenant_id, department_id, assignee_id, title, description, 
                            plan_date, is_done, is_high_priority, is_recurring, academic_year)
                         VALUES (?, ?, ?, ?, ?, NULL, FALSE, ?, TRUE, ?)`,
                        [ tenantId, plan.department_id, plan.assignee_id, plan.title, plan.description, plan.is_high_priority, destinationYear ]
                    );
                    copiedCount++;
                }
            }
        }
        await connection.commit();
        res.status(200).json({ 
            success: true, 
            message: `Rollover complete. ${copiedCount} new recurring plans were created for ${destinationYear}.` 
        });
    } catch (error) {
        await connection.rollback();
        console.error("Error during annual rollover:", error);
        res.status(500).json({ success: false, message: "Server error during rollover." });
    } finally {
        connection.release();
    }
};

const undoAnnualRollover = async (req, res) => {
    const { yearToDelete } = req.body;
    const tenantId = req.user.tenant_id;
    if (!yearToDelete) {
        return res.status(400).json({ success: false, message: "The year to clear is required." });
    }
    try {
        const [deleteResult] = await pool.query(
            "DELETE FROM plans WHERE academic_year = ? AND tenant_id = ?",
            [yearToDelete, tenantId]
        );
        const deletedCount = deleteResult.affectedRows;
        res.status(200).json({ 
            success: true, 
            message: `Undo complete. ${deletedCount} plans from ${yearToDelete} were deleted.` 
        });
    } catch (error) {
        console.error("Error during undo rollover:", error);
        res.status(500).json({ success: false, message: "Server error during undo." });
    }
};

module.exports = {
    getPlanData,
    createDepartment,
    updateDepartment,
    updateDepartmentMembers,
    deleteDepartment,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    performAnnualRollover,
    undoAnnualRollover,
};