// controllers/templateController.js
const pool = require('../config/db');

// --- CUSTOM FIELD CONTROLLERS ---

const createCustomField = async (req, res) => {
    try {
        // --- NEW: Receive 'profile_tab' from the frontend ---
        const { name, managed_by, profile_tab } = req.body;
        const tenant_id = req.user.tenant_id;
        if (!name || !managed_by || !profile_tab) {
            return res.status(400).json({ success: false, message: 'Field name, management level, and profile tab are required.' });
        }

        const [result] = await pool.query(
            'INSERT INTO custom_fields (tenant_id, name, type, managed_by, profile_tab) VALUES (?, ?, ?, ?, ?)', 
            [tenant_id, name, 'DROPDOWN', managed_by, profile_tab]
        );
        res.status(201).json({ success: true, data: { id: result.insertId, name, managed_by, profile_tab, options: [] } });
    } catch (error) {
        console.error("Create Custom Field Error:", error);
        res.status(500).json({ success: false, message: 'Server error creating field.' });
    }
};

// controllers/templateController.js

const getCustomFields = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;

        // ======================= THE FIX =======================
        // The `profile_tab` column was missing from this SQL query.
        // Adding it here ensures the frontend gets the data it needs.
        // =======================================================
        const [fields] = await pool.query(
            'SELECT id, name, type, managed_by, profile_tab FROM custom_fields WHERE tenant_id = ?', 
            [tenant_id]
        );
        
        if (fields.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }
        
        const fieldIds = fields.map(f => f.id);
        const [options] = await pool.query('SELECT * FROM custom_field_options WHERE field_id IN (?)', [fieldIds]);
        
        const structuredFields = fields.map(field => ({
            ...field,
            options: options.filter(opt => opt.field_id === field.id)
        }));

        res.status(200).json({ success: true, data: structuredFields });
    } catch (error) {
        console.error("Get Custom Fields Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching fields.' });
    }
};
const updateCustomField = async (req, res) => {
    try {
        await pool.query('UPDATE custom_fields SET name = ? WHERE id = ? AND tenant_id = ?', [req.body.name, req.params.fieldId, req.user.tenant_id]);
        res.status(200).json({ success: true, message: 'Field updated.' });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error updating field.' }); }
};

const deleteCustomField = async (req, res) => {
    try {
        await pool.query('DELETE FROM custom_fields WHERE id = ? AND tenant_id = ?', [req.params.fieldId, req.user.tenant_id]);
        res.status(200).json({ success: true, message: 'Field deleted.' });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error deleting field.' }); }
};


// --- CUSTOM FIELD OPTION CONTROLLERS ---

const createFieldOption = async (req, res) => {
    try {
        const { field_id, value } = req.body;
        const tenant_id = req.user.tenant_id;

        if (!field_id || !value) return res.status(400).json({ success: false, message: 'Field ID and option value are required.' });

        const [[field]] = await pool.query('SELECT tenant_id FROM custom_fields WHERE id = ?', [field_id]);
        if (!field) return res.status(404).json({ success: false, message: 'Custom field not found.' });
        if (field.tenant_id !== tenant_id) return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to modify this field.' });

        // --- THIS IS THE FIX ---
        // Changed `value` to `option_value` to match the database column name.
        const [result] = await pool.query('INSERT INTO custom_field_options (field_id, option_value) VALUES (?, ?)', [field_id, value]);
        
        res.status(201).json({ success: true, message: 'Option created successfully.', data: { id: result.insertId, option_value: value } });
    } catch (error) {
        console.error("Create Field Option Error:", error);
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'This option already exists for this field.' });
        res.status(500).json({ success: false, message: 'Server error creating option.' });
    }
};

const updateFieldOption = async (req, res) => {
    try {
        const { value } = req.body;
        // --- THIS IS THE FIX ---
        // Changed `value` to `option_value` to match the database column name.
        await pool.query('UPDATE custom_field_options SET option_value = ? WHERE id = ?', [value, req.params.optionId]);
        res.status(200).json({ success: true, message: 'Option updated.' });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error updating option.' }); }
};

const deleteFieldOption = async (req, res) => {
    try {
        const { optionId } = req.params;
        const tenant_id = req.user.tenant_id;
        const [result] = await pool.query(`DELETE cfo FROM custom_field_options cfo JOIN custom_fields cf ON cfo.field_id = cf.id WHERE cfo.id = ? AND cf.tenant_id = ?`, [optionId, tenant_id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Option not found or you do not have permission to delete it.' });
        res.status(200).json({ success: true, message: 'Option deleted.' });
    } catch (error) { 
        console.error("Delete Field Option Error:", error);
        res.status(500).json({ success: false, message: 'Server error deleting option.' }); 
    }
};

module.exports = { createCustomField, getCustomFields, updateCustomField, deleteCustomField, createFieldOption, updateFieldOption, deleteFieldOption };