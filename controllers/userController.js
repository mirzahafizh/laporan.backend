// Import dotenv untuk mengakses variabel lingkungan
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // pastikan path sesuai
const imagekit = require('../config/imageKit'); // pastikan konfigurasi sesuai dengan path

const { Op } = require('sequelize');

// Gunakan kunci rahasia dari file .env
const JWT_SECRET = process.env.JWT_SECRET;

// Register User
exports.register = async (req, res) => {
    try {
      const { username, password, role, email } = req.body; // Add email to the destructured fields
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Handle image upload
      const photo = req.file; // Assuming you're using multer to handle file uploads
  
      let fotoUrl = null;
      if (photo) {
        const response = await imagekit.upload({
          file: photo.buffer, // The file buffer
          fileName: photo.originalname, // Original file name
          folder: "users" // Optional: specify a folder in ImageKit
        });
        fotoUrl = response.url; // Get the URL of the uploaded image
      }
  
      // Create new user with email
      const newUser = await User.create({
        username,
        password: hashedPassword,
        role: role || 'user', // Default role 'user'
        foto: fotoUrl || null,
        email // Add email to the user creation
      });
  
      res.status(201).json({
        message: 'User registered successfully!',
        data: newUser
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error registering user',
        error: error.message
      });
    }
  };
  
  

// Login User
exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Cari user berdasarkan username
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found!',
        });
      }
  
      // Periksa password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid credentials!',
        });
      }
  
      // Buat token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Kembalikan semua data pengguna
      res.json({
        message: 'Login successful!',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email, // Pastikan email ada di model User
          photo: user.foto, // Pastikan foto ada di model User
          role: user.role,   // Pastikan role ada di model User
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error logging in',
        error: error.message
      });
    }
  };
  

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
      // Dapatkan semua user
      const users = await User.findAll({
        attributes: ['id', 'username', 'role', 'foto','email'], // pilih kolom yang ingin ditampilkan
      });
  
      res.json({
        message: 'Users fetched successfully!',
        data: users
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching users',
        error: error.message
      });
    }
};

// Get User by ID
exports.getUserById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Cari user berdasarkan ID
      const user = await User.findByPk(id, {
        attributes: ['id', 'username', 'role', 'foto', 'email'] // pilih kolom yang ingin ditampilkan
      });
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found!'
        });
      }
  
      res.json({
        message: 'User fetched successfully!',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user',
        error: error.message
      });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role, email, password } = req.body; // Include password in destructuring

        // Find user by ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Handle image upload
        let fotoUrl = user.foto; // Keep existing photo URL
        if (req.file) { // Check if a file was uploaded
            const response = await imagekit.upload({
                file: req.file.buffer, // The file buffer
                fileName: req.file.originalname, // Original file name
                folder: "users" // Optional: specify a folder in ImageKit
            });
            fotoUrl = response.url; // Update the URL with the new uploaded image
        }

        // Update user details
        user.username = username || user.username;
        user.role = role || user.role;
        user.email = email || user.email; // Update email if provided
        user.foto = fotoUrl; // Update photo URL

        // Hash new password if it was provided
        if (password) {
            user.password = await bcrypt.hash(password, 10); // Hash the new password
        }

        await user.save();

        res.json({ message: 'User updated successfully!', data: user });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};



  

// Delete User
exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Cari user berdasarkan ID
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found!'
        });
      }
  
      // Hapus user
      await user.destroy();
  
      res.json({
        message: 'User deleted successfully!'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting user',
        error: error.message
      });
    }
};
