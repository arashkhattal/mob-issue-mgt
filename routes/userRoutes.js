const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/authMiddleware'); // Middleware to check if user is admin

// Register new user
router.post('/register', userController.registerUser);

// Get all users
router.get('/users', userController.getAllUsers);

// Delete a user
router.delete('/users/:id', userController.deleteUser);

// Update a user
router.put('/users/:id', userController.updateUser);

// Login route
router.post('/users/login', userController.loginUser);

// Logout route requires authentication
router.post('/users/logout', userController.logoutUser);

// Get user by ID requires authentication
router.get('/users/:id', authMiddleware, userController.getUserById);

// Route to get users by role
router.get('/role/:role', userController.getUsersByRole);

module.exports = router;
