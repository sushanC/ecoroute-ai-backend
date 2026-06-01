const express = require('express');
const router = express.Router();
const {
  getRequests,
  createRequest,
  updateRequest,
} = require('../controllers/requestController');

router.route('/').get(getRequests).post(createRequest);
router.route('/:id').put(updateRequest);

module.exports = router;
