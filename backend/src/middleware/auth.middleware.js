const User = require("../models/user.model")
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Not Authorized" });
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if(!decoded) return res.status(401).json({ message: "Invalid token" });
  
  const user = await User.findById(decoded.userId).select("-password")
  if(!user) return res.status(404).json({ message: "user not found" });
    
  req.user = user;

    next();
    
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;