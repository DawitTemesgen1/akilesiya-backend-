const pool = require('../config/db');

const UserModel = {
  findByEmailAndTenant: async (email, tenantName) => {
    const [rows] = await pool.execute(
      `SELECT u.*, t.id as tenant_id, t.name as tenant_name 
       FROM users u 
       JOIN tenants t ON u.tenant_id = t.id 
       WHERE u.email = ? AND t.name = ?`,
      [email, tenantName]
    );
    return rows[0];
  },

  create: async (userData) => {
    const { id, email, password_hash, tenant_id } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (id, email, password_hash, tenant_id) VALUES (?, ?, ?, ?)',
      [id, email, password_hash, tenant_id]
    );
    // You would also insert into the profiles table here
    return result.affectedRows > 0;
  },
};

module.exports = UserModel;