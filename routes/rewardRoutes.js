const express = require('express');
const router = express.Router();

const {
  getRewards,
  awardPoints,
  redeemPoints,
  getHistory,
  getLeaderboard,
  applyReferral,
} = require('../controllers/rewardController');

router.get('/', getRewards);

router.post('/award', awardPoints);

router.post('/redeem', redeemPoints);

router.get('/history/:userId', getHistory);

router.get('/leaderboard', getLeaderboard);

router.post('/referral', applyReferral);

module.exports = router;