// controllers/profileController.js

const pool = require('../config/db');
const path = require('path');

/**
 * Helper function to compare old and new data and log every change.
 * This version is corrected to match the final database schema.
 */
const logChanges = async (connection, userId, oldProfile, newProfileData) => {
    const fieldsToLog = [ 'full_name', 'christian_name', 'confession_father_name', 'mother_name', 'gender', 'age', 'academic_level', 'phone_number', 'dob', 'parent_name', 'parent_phone_number', 'kifil' ];
    for (const field of fieldsToLog) {
        const oldValue = oldProfile[field] ? oldProfile[field].toString() : '';
        const newValue = newProfileData[field] ? newProfileData[field].toString() : '';
        if (oldValue !== newValue) {
            await connection.query('INSERT INTO change_logs (user_id, changed_by_user_id, field_name, old_value, new_value) VALUES (?, ?, ?, ?, ?)', [userId, userId, field, oldValue, newValue]);
        }
    }

    if (newProfileData.custom_field_values && typeof newProfileData.custom_field_values === 'object') {
        const [oldCustomValuesRaw] = await connection.query('SELECT cf.name, cfo.option_value FROM custom_field_values cfv JOIN custom_fields cf ON cfv.field_id = cf.id JOIN custom_field_options cfo ON cfv.option_id = cfo.id WHERE cfv.user_id = ?', [userId]);
        const oldCustomValues = oldCustomValuesRaw.reduce((acc, row) => { acc[row.name] = row.option_value; return acc; }, {});
        const [allCustomFields] = await connection.query('SELECT cf.id, cf.name, cfo.id as option_id, cfo.option_value FROM custom_fields cf JOIN custom_field_options cfo ON cf.id = cfo.field_id');

        for (const field_id in newProfileData.custom_field_values) {
            const newOptionId = newProfileData.custom_field_values[field_id];
            const fieldInfo = allCustomFields.find(f => f.id.toString() === field_id);
            if (!fieldInfo) continue;

            const oldValue = oldCustomValues[fieldInfo.name] || '';
            const newOption = allCustomFields.find(o => o.option_id.toString() === newOptionId);
            const newValue = newOption ? newOption.option_value : '';

            if (oldValue !== newValue) {
                 await connection.query('INSERT INTO change_logs (user_id, changed_by_user_id, field_name, old_value, new_value) VALUES (?, ?, ?, ?, ?)', [userId, userId, `Custom: ${fieldInfo.name}`, oldValue, newValue]);
            }
        }
    }
};

const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`[getMyProfile] Fetching profile for user ID: ${userId}`);

        const [[profile]] = await pool.query(`SELECT p.*, u.email, u.role FROM profiles p JOIN users u ON p.user_id = u.id WHERE p.user_id = ?`, [userId]);
        if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

        const [[enrollment]] = await pool.query(`SELECT spiritual_class FROM batch_enrollments WHERE user_id = ? AND is_active = 1 LIMIT 1`, [userId]);
        profile.spiritual_class = enrollment ? enrollment.spiritual_class : profile.spiritual_class;
        
        // --- THIS IS THE CRITICAL FIX ---
        // This query was flawed or missing in previous versions. This is the correct one.
        const [customValues] = await pool.query('SELECT field_id, option_id FROM custom_field_values WHERE user_id = ?', [userId]);
        
        // Attach the array (even if empty) to the profile object.
        profile.custom_field_values = customValues;

        console.log(`[getMyProfile] SUCCESS: Sending profile data for user ${userId}.`);
        console.log(`[getMyProfile] Custom field values sent:`, JSON.stringify(profile.custom_field_values, null, 2));
        
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        console.error("[getMyProfile] FATAL ERROR:", error);
        res.status(500).json({ success: false, message: "Server error getting profile." });
    }
};

const updateMyProfile = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const userId = req.user.id;
        const newProfileData = req.body;
        
        await connection.beginTransaction();
        const [[oldProfile]] = await connection.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
        if (!oldProfile) { await connection.rollback(); return res.status(404).json({ success: false, message: 'Profile not found.' }); }

        // --- THIS IS THE CRITICAL FIX: The logChanges function is now active ---
        await logChanges(connection, userId, oldProfile, newProfileData);

        const safeAge = (newProfileData.age != null && newProfileData.age !== '' && !isNaN(newProfileData.age)) ? parseInt(newProfileData.age) : null;
        const safeDob = (newProfileData.dob && newProfileData.dob.length > 0) ? newProfileData.dob : null;
        await connection.query(`UPDATE profiles SET full_name=?, christian_name=?, confession_father_name=?, mother_name=?, gender=?, age=?, academic_level=?, phone_number=?, dob=?, parent_name=?, parent_phone_number=?, kifil=? WHERE user_id=?`, [newProfileData.full_name, newProfileData.christian_name, newProfileData.confession_father_name, newProfileData.mother_name, newProfileData.gender, safeAge, newProfileData.academic_level, newProfileData.phone_number, safeDob, newProfileData.parent_name, newProfileData.parent_phone_number, newProfileData.kifil, userId]);

        if (newProfileData.custom_field_values && typeof newProfileData.custom_field_values === 'object') {
            await connection.query('DELETE FROM custom_field_values WHERE user_id = ?', [userId]);
            for (const field_id in newProfileData.custom_field_values) {
                const option_id = newProfileData.custom_field_values[field_id];
                if (option_id && option_id !== 'null' && option_id !== null) {
                    // --- THIS IS THE CRITICAL FIX ---
                    // Inserts into 'option_id' to match the final schema
                    await connection.query(`INSERT INTO custom_field_values (user_id, field_id, option_id) VALUES (?, ?, ?)`, [userId, field_id, option_id]);
                }
            }
        }
        
        await connection.commit();
        res.status(200).json({ success: true, message: 'Profile updated successfully.' });
    } catch (error) {
        if(connection) await connection.rollback();
        console.error("[updateMyProfile] FATAL ERROR:", error);
        res.status(500).json({ success: false, message: "Server error while updating profile." });
    } finally {
        if(connection) connection.release();
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No image file uploaded.' });
        const imageUrl = path.join('uploads', req.file.filename).replace(/\\/g, '/');
        await pool.query(`UPDATE profiles SET profile_image_url = ? WHERE user_id = ?`, [imageUrl, req.user.id]);
        res.status(200).json({ success: true, message: 'Avatar updated.', data: { filename: imageUrl } });
    } catch (error) {
        console.error("[uploadAvatar] ERROR:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const [history] = await pool.query(`SELECT attendance_date as date, status, attendance_type as type FROM attendance WHERE user_id = ? ORDER BY attendance_date DESC`, [req.user.id]);
        res.status(200).json({ success: true, data: history });
    } catch (error) { res.status(500).json({ success: false, message: "Server error fetching attendance." }); }
};

const getMyGrades = async (req, res) => {
    try {
        const [enrollments] = await pool.query(`SELECT spiritual_class, academic_year FROM batch_enrollments WHERE user_id = ? ORDER BY academic_year DESC`, [req.user.id]);
        if (enrollments.length === 0) return res.status(200).json({ success: true, data: [] });
        const gradeHistory = [];
        for (const enrollment of enrollments) {
            const [scores] = await pool.query(`SELECT c.course_name as courseName, a.max_score as maxScore, ss.score FROM student_scores ss JOIN assessments a ON ss.assessment_id = a.id JOIN courses c ON ss.course_id = c.id WHERE ss.user_id = ? AND ss.academic_year = ?`, [req.user.id, enrollment.academic_year]);
            const courses = {};
            scores.forEach(s => {
                if (!courses[s.courseName]) courses[s.courseName] = { totalScore: 0, totalMaxScore: 0 };
                courses[s.courseName].totalScore += parseFloat(s.score);
                courses[s.courseName].totalMaxScore += s.maxScore;
            });
            const gradeDetails = Object.keys(courses).map(courseName => ({
                courseName,
                total: courses[courseName].totalMaxScore > 0 ? parseFloat(((courses[courseName].totalScore / courses[courseName].totalMaxScore) * 100).toFixed(1)) : 0
            }));
            const overallAverage = gradeDetails.length > 0 ? parseFloat((gradeDetails.reduce((acc, curr) => acc + curr.total, 0) / gradeDetails.length).toFixed(1)) : 0;
            gradeHistory.push({ spiritualClass: enrollment.spiritual_class, academicYear: enrollment.academic_year, average: overallAverage, grades: gradeDetails });
        }
        res.status(200).json({ success: true, data: gradeHistory });
    } catch (error) { res.status(500).json({ success: false, message: "Server error fetching grades." }); }
};

const getMyBooks = async (req, res) => {
    try {
        const [books] = await pool.query(`SELECT ab.id, b.title, ab.deadline, ab.is_read FROM assigned_books ab JOIN books b ON ab.book_id = b.id WHERE ab.user_id = ? ORDER BY ab.deadline ASC`, [req.user.id]);
        res.status(200).json({ success: true, data: books });
    } catch (error) { res.status(500).json({ success: false, message: "Server error fetching books." }); }
};

const updateBookStatus = async (req, res) => {
    try {
        const { isRead } = req.body;
        if (typeof isRead !== 'boolean') return res.status(400).json({ success: false, message: 'isRead must be a boolean.' });
        const [result] = await pool.query('UPDATE assigned_books SET is_read = ? WHERE id = ? AND user_id = ?', [isRead, req.params.assignedBookId, req.user.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Assigned book not found.' });
        res.status(200).json({ success: true, message: 'Book status updated.' });
    } catch (error) { res.status(500).json({ success: false, message: "Server error updating book status." }); }
};

module.exports = { 
    getMyProfile, 
    updateMyProfile,
    uploadAvatar,
    getMyAttendance,
    getMyGrades,
    getMyBooks,
    updateBookStatus
};