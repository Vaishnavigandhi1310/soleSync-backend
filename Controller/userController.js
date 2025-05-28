const userModel = require("../Model/UserModel");
const { otp, sentOtp } = require("../utils/helper");
const { createHmac } = require('crypto');

const addUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let userdata = await userModel.findOne({ email });

    if (!userdata) {
      userdata = await new userModel({ name, email, password }).save(); 
      return res.status(201).send({ message: "User created", data: userdata });
    } else {
      return res.status(409).send({ message: "Email already exists" });
    }
  } catch (error) {
    console.error("Error in addUser:", error);
    return res.status(500).send({ message: "Error", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userdata = await userModel.find({});
    return res.status(200).send({ message: "Successful", data: userdata });
  } catch (error) {
    console.error("Error in getUser:", error);
    return res
      .status(500)
      .send({ message: "Failed", data: "", error: error.message || error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await userModel.matchPassword(email, password);
    res.status(200).send({ message: "Login success", data: token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res
      .status(401)
      .send({ message: "Login Failed", data: "", Error: error.message });
  }
};



const verifyOTP = async (req, res) => {
  const { email } = req.params;
  const { otp } = req.body;
  
  try {
    let userdata = await userModel.findOne({ email });

    if (!userdata) {
      return res.status(404).send({ message: "User not found", data: "" });
    }

  
    if (userdata.otp === otp) {
    
      await userModel.updateOne(
        { email: userdata.email },
        { $set: { otp: null } } 
      );

  
      return res.status(200).send({
        message: "OTP verified! You can now reset your password.",
        data: userdata,
      });
    } else {
      return res.status(400).send({ message: "Invalid OTP", data: "" });
    }
  } catch (error) {
    res.status(400).send({
      message: "Request Failed!",
      data: "",
      error: error.message || error,
    });
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found with this email",
      });
    }

    let code = otp(6);
    console.log("Generated OTP:", code);

    await userModel.updateOne(
      { email: user.email },
      { $set: { otp: code } }
    );

    sentOtp(user.email, code);

    return res.status(200).send({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message || error,
    });
  }
};


const resetPassword = async (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.password = password; 
    await user.save();

    return res.status(200).send({ message: "Password updated!" });
  } catch (error) {
    return res.status(400).send({
      message: "Request Failed!",
      error: error.message || error,
    });
  }
};

module.exports = {
  addUser,
  getUser,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
};
