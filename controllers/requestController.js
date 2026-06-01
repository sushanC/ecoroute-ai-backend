const Request = require('../models/Request');

const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

const createRequest = async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    if (!data.lat || !data.lng) {
      data.lat = 12.9735 + (Math.random() - 0.5) * 0.005;
      data.lng = 77.6075 + (Math.random() - 0.5) * 0.005;
    }

    const request = await Request.create(data);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

const updateRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    const wasCompleted = request.status === 'completed';
    
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!wasCompleted && updatedRequest.status === 'completed') {
       const User = require('../models/User');
       const user = await User.findOne({ name: request.name }) || await User.findOne({ email: 'user@eco.com' });
       if (user) {
         user.rewardPoints += 10;
         await user.save();
       }
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRequests,
  createRequest,
  updateRequest,
};
