const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post('/', communityController.createCommunity);
router.get('/', communityController.listCommunities);
router.get('/:id', communityController.getCommunity);
router.put('/:id', communityController.updateCommunity);

module.exports = router;
