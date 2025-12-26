const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Public
const getTenants = async (req, res) => {
    try {
        const [tenants] = await pool.query('SELECT id, name FROM tenants ORDER BY name');
        res.status(200).json(tenants);
    } catch (error) {
        console.error('Error fetching tenants:', error);
        res.status(500).json({ message: 'Server error while fetching tenants.' });
    }
};

// @desc    Create a new tenant
// @route   POST /api/tenants
// @access  Private (should be protected by an admin middleware in a real app)
const createTenant = async (req, res) => {
    const { name, logoUrl, primaryColor, accentColor } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Tenant name is required.' });
    }

    try {
        const tenantId = uuidv4();
        const [result] = await pool.query(
            'INSERT INTO tenants (id, name, logo_url, primary_color, accent_color) VALUES (?, ?, ?, ?, ?)',
            [tenantId, name, logoUrl, primaryColor, accentColor]
        );

        res.status(201).json({
            id: tenantId,
            name,
            logoUrl,
            primaryColor,
            accentColor
        });
    } catch (error) {
        console.error('Error creating tenant:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'A tenant with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error while creating tenant.' });
    }
};

// @desc    Get custom fields for a specific tenant (Public)
// @route   GET /api/tenants/:tenantId/custom-fields
// @access  Public
const getTenantCustomFields = async (req, res) => {
    try {
        const { tenantId } = req.params;

        // Fetch fields
        const [fields] = await pool.query(
            'SELECT id, name, type, managed_by, profile_tab FROM custom_fields WHERE tenant_id = ? ORDER BY id',
            [tenantId]
        );

        if (fields.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Fetch options for these fields
        const fieldIds = fields.map(f => f.id);
        const [options] = await pool.query('SELECT * FROM custom_field_options WHERE field_id IN (?)', [fieldIds]);

        // Structure the response
        const structuredFields = fields.map(field => ({
            ...field,
            options: options.filter(opt => opt.field_id === field.id)
        }));

        res.status(200).json({ success: true, data: structuredFields });
    } catch (error) {
        console.error("Get Tenant Custom Fields Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching custom fields.' });
    }
};

module.exports = {
    getTenants,
    createTenant,
    getTenantCustomFields,
};