const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = "qwertyuiop";

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    await newUser.save();

    res.status(200).json({
      message: "User created",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const getUser = await User.find();

    res
      .status(200)
      .json({ message: "user fetched successfully", data: getUser });
  } catch (err) {
    res.status(500).json({ message: "user not fetched" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone, role } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, phone, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Email updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const editUser = await User.findById(id);

    res
      .status(200)
      .json({ message: "user fetched successfully", data: editUser });
  } catch (err) {
    res.status(500).json({ message: "user not fetched" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "user Deleted successfully", data: deletedUser });
  } catch (err) {
    res.status(500).json({ message: "user not fetched" });
  }
};

const LoginUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userID: user._id, username: user.name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  editUser,
  LoginUser,
};
