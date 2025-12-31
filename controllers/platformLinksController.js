// src/controllers/platformLinksController.js

const pool = require('../config/db');

/**
 * @desc    Get all platform links for the user's tenant
 * @route   GET /api/platform-links
 * @access  Private (All authenticated users of a tenant can view)
 */
const getAllLinks = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const [links] = await pool.query(
            'SELECT * FROM platform_links WHERE tenant_id = ? ORDER BY display_order ASC, name ASC',
            [tenantId]
        );
        res.status(200).json({ success: true, data: links });
    } catch (error) {
        console.error('Error fetching platform links:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching links.' });
    }
};

/**
 * @desc    Create a new platform link
 * @route   POST /api/platform-links
 * @access  Private (Superior Admin only)
 */
const createLink = async (req, res) => {
    const { name, url, icon_name, color, is_social_media, display_order } = req.body;
    const tenantId = req.user.tenant_id;

    if (!name || !url || !icon_name || !color) {
        return res.status(400).json({ success: false, message: 'Please provide name, url, icon, and color.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO platform_links (tenant_id, name, url, icon_name, color, is_social_media, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [tenantId, name, url, icon_name, color, is_social_media || false, display_order || 0]
        );
        
        const [[newLink]] = await pool.query('SELECT * FROM platform_links WHERE id = ?', [result.insertId]);
        
        res.status(201).json({ success: true, data: newLink });
    } catch (error) {
        console.error('Error creating link:', error);
        res.status(500).json({ success: false, message: 'Server error while creating link.' });
    }
};

/**
 * @desc    Update an existing platform link
 * @route   PUT /api/platform-links/:id
 * @access  Private (Superior Admin only)
 */
const updateLink = async (req, res) => {
    const { id } = req.params;
    const { name, url, icon_name, color, is_social_media, display_order } = req.body;
    const tenantId = req.user.tenant_id;

    if (!name || !url || !icon_name || !color) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    try {
        // The "AND tenant_id = ?" is a CRITICAL security check to ensure an admin
        // from one school cannot edit links from another school.
        const [result] = await pool.query(
            'UPDATE platform_links SET name = ?, url = ?, icon_name = ?, color = ?, is_social_media = ?, display_order = ? WHERE id = ? AND tenant_id = ?',
            [name, url, icon_name, color, is_social_media, display_order, id, tenantId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Link not found or you do not have permission to edit it.' });
        }
        
        const [[updatedLink]] = await pool.query('SELECT * FROM platform_links WHERE id = ?', [id]);
        res.status(200).json({ success: true, data: updatedLink });
    } catch (error) {
        console.error('Error updating link:', error);
        res.status(500).json({ success: false, message: 'Server error while updating link.' });
    }
};

/**
 * @desc    Delete a platform link
 * @route   DELETE /api/platform-links/:id
 * @access  Private (Superior Admin only)
 */
const deleteLink = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.user.tenant_id;

    try {
        // The "AND tenant_id = ?" is the same critical security check.
        const [result] = await pool.query(
            'DELETE FROM platform_links WHERE id = ? AND tenant_id = ?',
            [id, tenantId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Link not found or you do not have permission to delete it.' });
        }

        res.status(200).json({ success: true, message: 'Link deleted successfully.' });
    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting link.' });
    }
};

module.exports = {
    getAllLinks,
    createLink,
    updateLink,
    deleteLink,
};