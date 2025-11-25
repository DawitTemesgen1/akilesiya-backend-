const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/user.model');
require('dotenv').config();

const authService = {
  registerUser: async (profileData) => {
    // In a real app, you would have a transaction here to ensure both user and profile are created
    const password_hash = await bcrypt.hash(profileData.password, 10);
    const userId = uuidv4();
    
    await UserModel.create({
      id: userId,
      email: profileData.email,
      password_hash,
      tenant_id: profileData.tenantId,
    });
    
    // Here you would also create the profile in the 'profiles' table using the other profileData fields

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // The data returned here should match what your Flutter app expects
    return {
      success: true,
      data: {
        token,
        tenant: { id: profileData.tenantId, name: 'Tenant Name' }, // You'd fetch the tenant name
      },
    };
  },

  loginUser: async (email, password, tenantName) => {
    const user = await UserModel.findByEmailAndTenant(email, tenantName);
    if (!user) {
      throw new Error('Invalid credentials or school selection.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials.');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return {
      success: true,
      data: {
        token,
        tenant: { id: user.tenant_id, name: user.tenant_name },
      },
    };
  },
};

module.exports = authService;