const express = require('express');
const router = express.Router();
const {
  getBins,
  createBin,
  updateBin,
} = require('../controllers/binController');

router.route('/').get(getBins).post(createBin);
router.route('/:id').put(updateBin);

module.exports = router;
