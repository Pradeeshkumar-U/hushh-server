const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// In a real app, you would add authentication middleware here
router.post('/', adminController.addAdmin);
router.delete('/:id', adminController.deleteAdmin);
router.get('/', adminController.listAdmins);

module.exports = router;
