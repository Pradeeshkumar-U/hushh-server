require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const imageRoutes = require('./routes/imageRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const communityRoutes = require('./routes/communityRoutes');
const collegeRoutes = require('./routes/collegeRoutes'); // New import
const communityMiddleware = require('./middlewares/communityMiddleware');

app.use('/api/admins', communityMiddleware, adminRoutes);
app.use('/api/events', communityMiddleware, eventRoutes);
app.use('/api/images', communityMiddleware, imageRoutes);
app.use('/api/analytics', communityMiddleware, analyticsRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/communities', communityRoutes);


// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Hushh Connect Backend running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
