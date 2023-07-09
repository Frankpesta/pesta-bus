const router = require("express").Router();
const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const authMiddleware = require("../middlewares/authMiddleware");
const stripe = require("stripe")(process.env.stripe_secret_key);
const { v4: uuidv4 } = require("uuid");

//Book a seat

router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      user: req.body.userId,
    });
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus);
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
    await bus.save();
    res.status(200).send({
      message: "Booking Successful",
      success: true,
      data: newBooking,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking Unsuccessful",
      success: false,
      data: error,
    });
  }
});

//make payment

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: "NGN",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      res.status(200).send({
        message: "Payment Successful",
        data: {
          transactionId: payment.source.id,
        },
        success: true,
      });
    } else {
      res.status(400).send({
        message: "Payment failed",
        data: error,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Payment Failed",
      success: false,
      data: error,
    });
  }
});

//get bookings by user-id
router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.body.userId,
    })
      .populate("bus")
      .populate("user");
    res.status(200).send({
      message: "Bookings fetched successfully",
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

//Get all Bookings

router.post('/get-all-bookings', authMiddleware, async (req, res) => {
  try {
    const allBookings = await Booking.find()
    .populate("bus")
    .populate("user")
    res.status(200).send({
      message: "Bookings fetched successfully",
      success: true,
      data: allBookings,
    })
  } catch (error) {
    res.status(400).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
})

module.exports = router;
