const userModel = require("../models/user.model");
const tokenGenerator = require("../utils/token");

async function registerHanlder(req, res) {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    const isuser = await userModel.findOne({ email });
    if (isuser) {
      return res.status(400).json({ err: "User already exists" });
    }
    const user = await userModel.create({
      username,
      email,
      password,
    });
    const token = tokenGenerator(user);
    res.cookie("token", token);
    res.status(201).json({
      msg: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ err: "Internal Server Error" });
  }
}

async function loginHandler(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ err: "User does not exist" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ err: "Invalid credentials" });
    } 
    const token = tokenGenerator(user);
    res.cookie("token", token);
    res.status(200).json({
      msg: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ err: "Internal Server Error" });
  }
}

module.exports = {
  registerHanlder,
  loginHandler,
};
