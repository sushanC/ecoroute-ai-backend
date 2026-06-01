const express = require('express');
const router = express.Router();
const {
  getTrucks,
  createTruck,
  updateTruck,
} = require('../controllers/truckController');

router.route('/').get(getTrucks).post(createTruck);
router.route('/:id').put(updateTruck);

module.exports = router;
