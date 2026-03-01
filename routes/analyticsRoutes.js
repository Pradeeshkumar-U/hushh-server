const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/dashboard', analyticsController.getDashboardAnalytics);
router.get('/events/:id', analyticsController.getEventAnalytics);

module.exports = router;
