const router = require("express").Router();
const Bus = require("../models/busModel");
const authMiddleware = require("../middlewares/authMiddleware");

//Add bus

router.post("/add-bus", authMiddleware, async (req, res) => {
  try {
    const existingBus = await Bus.findOne({ number: req.body.number });
    if (existingBus) {
      return res.status(400).send({
        success: false,
        message: "Bus already Exists",
        data: null,
      });
    }

    const newBus = new Bus(req.body);
    await newBus.save();
    return res.status(200).send({
      success: true,
      message: "Bus added successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

//getting all buses
router.post("/get-all-buses", authMiddleware, async (req, res) => {
  try {
    const buses = await Bus.find(req.body.filter);
     res.status(200).send({
        message: "Buses fetched successfully",
        success: true,
        data: buses,
      });
    }
   catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

//Update bus

router.post("/update-bus", authMiddleware, async (req, res) => {
  try {
    await Bus.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: "Bus updated successfully",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

//Delete Bus

router.post("/delete-bus", authMiddleware, async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Bus Deleted successfully.",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

//get bus by id

router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
  try {
    const bus = await Bus.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Bus fetched successfully",
      data: bus,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
