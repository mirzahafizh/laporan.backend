const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // memasukkan informasi user ke request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token!' });
  }
};
