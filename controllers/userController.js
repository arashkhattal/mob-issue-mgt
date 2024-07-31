const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const secret = process.env.JWT_SECRET || "thiscanbeanything";

// Register new user
exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Check if role is admin
    if (role === "admin") {
      const adminExists = await User.findOne({ role: "admin" });
      if (adminExists) {
        return res.status(400).json({ error: "Admin user already exists" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log("id :", id); // Log the ID

  try {
    const user = await User.findById(id);
    console.log("user :", user); // Log the user object

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Server error:", err); // Log the error
    res.status(500).json({ error: "Server error" });
  }
};

// exports.deleteUser = async (req, res) => {
//   const { id } = req.params;

//   // Validate the ObjectId
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: "Invalid user ID" });
//   }

//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     await user.deleteOne(); // Use deleteOne() instead of remove()
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   const { id } = req.params;
//   console.log("id :", id); // Log the ID

//   try {
//     const user = await User.findById(id);
//     console.log("user :", user); // Log the user object

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     await User.findByIdAndDelete(id);
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error("Server error:", err); // Log the error
//     res.status(500).json({ error: "Server error" });
//   }
// };



// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username) user.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (role) user.role = role;

    await user.save();
    res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.json({ token, role: user.role, userId:user._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  res.json({ msg: "Logout successful" });
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get user by role
exports.getUsersByRole = async (req, res) => {
  try {
    const role = req.params.role;
    const users = await User.find({ role });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};