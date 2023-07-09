const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

//register route

router.post("/register", async (req, res) => {
  try {
    //checking if there's already a user with the same email and returning an error if true
    const exisitingUser = await User.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res.send({
        message: "User already exists",
        success: false,
        data: null,
      });
    }
    //using bcrypt to hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    //creating new user
    const newUser = new User(req.body);
    await newUser.save(); //saving new user to the database
    res.send({
      message: "New User Created Successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

//Login user
router.post("/login", async (req, res) => {
  try {
    const userExits = await User.findOne({ email: req.body.email });
    if (!userExits) {
      return res.send({
        message: "User does not exist",
        success: false,
        data: null,
      });
    }

    if(userExits.isBlocked){
      return res.send({
        message: 'Your account is Blocked. Please contact Admin.',
        success: false,
        data: null,
      })
    }

    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userExits.password
    );
    if (!passwordMatches) {
      return res.send({
        message: "Incorrect Password",
        success: false,
        data: null,
      });
    }

    const token = jwt.sign({ userId: userExits._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });
    res.send({
      message: "User logged in Successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

//get user by id

router.post("/get-user-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

router.post("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).send({
      message: "Request Failed",
      success: false,
      data: error,
    });
  }
});

//update user 

router.post('/update-user-permissions', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      message: 'User permissions updated successfully',
      success: true,
      data: null
    })
  } catch (error) {
    res.status(400).send({
      message: "Request Failed",
      success: false,
      data: error,
    });
  }
})

module.exports = router;
