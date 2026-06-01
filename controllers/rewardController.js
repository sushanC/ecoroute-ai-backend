const Reward = require('../models/Reward');
const User = require('../models/User');

/* =====================================================
   Get All Rewards (Admin)
===================================================== */
const getRewards = async (req, res, next) => {
  try {
    const rewards = await Reward.find()
      .populate('userId', 'name email role rewardPoints')
      .sort({ createdAt: -1 });

    res.status(200).json(rewards);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   Award Points
===================================================== */
const awardPoints = async (req, res, next) => {
  try {
    const { userId, actionType } = req.body;

    let pointsAwarded = 0;
    let benefitType = '';

    if (actionType === 'valid_report') {
      pointsAwarded = 50;
      benefitType = 'Valid Waste Report';
    } else if (actionType === 'overflow_prevention') {
      pointsAwarded = 100;
      benefitType = 'Overflow Prevention Bonus';
    } else {
      return res.status(400).json({
        message: 'Invalid action type',
      });
    }

    const reward = await Reward.create({
      userId,
      points: pointsAwarded,
      benefitType,
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { rewardPoints: pointsAwarded },
    });

    res.status(201).json({
      message: `${pointsAwarded} points awarded`,
      reward,
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   Redeem Points
===================================================== */
const redeemPoints = async (req, res, next) => {
  try {
    const { userId, redeemType } = req.body;

    const offers = {
      amazon: { cost: 500, title: '₹50 Amazon Voucher' },
      metro: { cost: 300, title: '1 Day Metro Pass' },
      coffee: { cost: 200, title: 'Free Coffee Coupon' },
      tshirt: { cost: 1000, title: 'EcoRoute T-Shirt' },
      movie: { cost: 700, title: 'Movie Ticket' },
      tree: { cost: 150, title: 'Tree Donation' },
      grocery: { cost: 450, title: 'Grocery Coupon' },
      swiggy: { cost: 350, title: 'Swiggy Discount' },
    };

    if (!offers[redeemType]) {
      return res.status(400).json({
        message: 'Invalid reward type',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { cost, title } = offers[redeemType];

    if (user.rewardPoints < cost) {
      return res.status(400).json({
        message: `Need ${cost} points`,
      });
    }

    user.rewardPoints -= cost;
    user.totalClaims += 1;
    await user.save();

    const reward = await Reward.create({
      userId,
      points: -cost,
      benefitType: `Claimed: ${title}`,
    });

    res.status(200).json({
      message: `${title} claimed successfully`,
      rewardPoints: user.rewardPoints,
      reward,
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   Claim History
===================================================== */
const getHistory = async (req, res, next) => {
  try {
    const rewards = await Reward.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(rewards);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   Leaderboard
===================================================== */
const getLeaderboard = async (req, res, next) => {
  try {
    const leaders = await User.find({ role: 'user' })
      .select('name rewardPoints totalClaims')
      .sort({ rewardPoints: -1 })
      .limit(10);

    res.status(200).json(leaders);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   Referral System
===================================================== */
const applyReferral = async (req, res, next) => {
  try {
    const { userId, referralCode } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (user.referredBy) {
      return res.status(400).json({
        message: 'Referral already used',
      });
    }

    const referrer = await User.findOne({
      referralCode,
    });

    if (!referrer) {
      return res.status(404).json({
        message: 'Invalid referral code',
      });
    }

    if (String(referrer._id) === String(user._id)) {
      return res.status(400).json({
        message: 'Cannot use your own code',
      });
    }

    // Bonus points
    user.rewardPoints += 100;
    user.referredBy = referralCode;

    referrer.rewardPoints += 100;

    await user.save();
    await referrer.save();

    await Reward.create({
      userId: user._id,
      points: 100,
      benefitType: 'Referral Bonus',
    });

    await Reward.create({
      userId: referrer._id,
      points: 100,
      benefitType: 'Referral Invite Bonus',
    });

    res.status(200).json({
      message: 'Referral applied successfully',
      rewardPoints: user.rewardPoints,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRewards,
  awardPoints,
  redeemPoints,
  getHistory,
  getLeaderboard,
  applyReferral,
};