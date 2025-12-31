/**
 * =============================================================================
 * MAIN SERVER FILE (server.js) - CORRECTED
 * =============================================================================
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

// Load environment variables from the .env file into process.env
dotenv.config();

// --- Import Route Files ---
const authRoutes = require('./routes/authRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const batchRoutes = require('./routes/batchRoutes');
const bookRoutes = require('./routes/bookRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const planRoutes = require('./routes/planRoutes');
const developmentRoutes = require('./routes/developmentRoutes');
const familyRoutes = require('./routes/familyRoutes');
const privateFeedRoutes = require('./routes/privateFeedRoutes');
const learningRoutes = require('./routes/learningRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const publicFeedRoutes = require('./routes/publicFeedRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userAdminRoutes = require('./routes/userAdminRoutes');
const templateRoutes = require('./routes/templateRoutes');
const auditRoutes = require('./routes/auditRoutes');
const screenTimeRoutes = require('./routes/screenTimeRoutes');
const systemAdminRoutes = require('./routes/systemAdminRoutes');
const platformLinksRoutes = require('./routes/platformLinksRoutes');
const permissionRoutes = require('./routes/permissionRoutes');

// Initialize the Express application
const app = express();

// --- Global Middlewares ---
app.use(cors());
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(express.json());

// --- ADD THIS MIDDLEWARE ---
// This makes the 'public' folder accessible from the web.
// For example, an image at 'public/uploads/image.jpg' will be available at 'http://yourserver.com/uploads/image.jpg'
app.use(express.static(path.join(__dirname, 'public')));
// -------------------------

// --- API Route Mounting ---
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/development', developmentRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/private-feed', privateFeedRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/public-feed', publicFeedRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user-admin', userAdminRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/screentime', screenTimeRoutes);
app.use('/api/system-admin', systemAdminRoutes);
app.use('/api/platform-links', platformLinksRoutes);
app.use('/api/admin/permissions', permissionRoutes);

// --- Health Check Endpoint ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});