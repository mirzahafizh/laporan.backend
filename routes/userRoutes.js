const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
// Register
router.post('/register',upload.single('profileImage'), userController.register);

// Login
router.post('/login', userController.login);
//Get All Users
router.get('/user', userController.getAllUsers);
// Get User by ID
router.get('/user/:id', userController.getUserById);

// Update User by ID
router.put('/user/:id',upload.single('profileImage'), userController.updateUser);

// Delete User by ID
router.delete('/user/:id', userController.deleteUser);


module.exports = router;
