const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  if (!process.env.SECRET) {
    throw new Error("JWT SECRET is not defined");
  }
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create token
    const token = createToken(user._id);

    // Include user ID and name in response
    res.status(200).json({
      email,
      token,
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add logout function
const logoutUser = (req, res) => {
  // Clear the token cookie if using httpOnly cookies
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

//signup user
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.signup(firstName, lastName, email, password);

    //create token
    const token = createToken(user._id);

    res.status(201).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  logoutUser,
};
