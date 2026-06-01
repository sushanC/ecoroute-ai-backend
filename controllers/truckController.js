const Truck = require('../models/Truck');


const getTrucks = async (req, res, next) => {
  try {
    const trucks = await Truck.find();
    res.status(200).json(trucks);
  } catch (error) {
    next(error);
  }
};


const createTruck = async (req, res, next) => {
  try {
    const truck = await Truck.create(req.body);
    res.status(201).json(truck);
  } catch (error) {
    next(error);
  }
};


const updateTruck = async (req, res, next) => {
  try {
    const truck = await Truck.findById(req.params.id);

    if (!truck) {
      res.status(404);
      throw new Error('Truck not found');
    }

    const updatedTruck = await Truck.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTruck);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrucks,
  createTruck,
  updateTruck,
};
