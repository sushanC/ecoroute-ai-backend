const Bin = require('../models/Bin');

const getBins = async (req, res, next) => {
  try {
    const bins = await Bin.find();
    res.status(200).json(bins);
  } catch (error) {
    next(error);
  }
};

const createBin = async (req, res, next) => {
  try {
    const bin = await Bin.create(req.body);
    res.status(201).json(bin);
  } catch (error) {
    next(error);
  }
};

const updateBin = async (req, res, next) => {
  try {
    const bin = await Bin.findById(req.params.id);

    if (!bin) {
      res.status(404);
      throw new Error('Bin not found');
    }
    if (req.body.fillLevel !== undefined) {
      bin.fillLevel = req.body.fillLevel;
    }

    Object.keys(req.body).forEach(key => {
        if(key !== 'fillLevel') {
            bin[key] = req.body[key];
        }
    })

    const updatedBin = await bin.save();

    res.status(200).json(updatedBin);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBins,
  createBin,
  updateBin,
};
