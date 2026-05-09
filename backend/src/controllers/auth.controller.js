// src/controllers/authController.js
const bcrypt = require("bcrypt");
const Tenant = require("../models/tenant.model");
const User = require("../models/user.model");
const {generateToken} = require("../lib/utils")


//Register controller
exports.register = async (req, res) => {
  const { businessName, email, password, role = "admin" } = req.body;

  try {
    if (!businessName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        
        if (password.length < 6){
            
            return res.status(400).json({message:"Password must be atleast 6 characters"});
        }
        
        // check if email is valid: regex
        const emailRegex  = /^[^@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            
            return res.status(400).json({message:"Invalid email format"});
        }

        // check if User or Tenant exists
    const userExists = await User.findOne({email});
    
    if(userExists){
        return res.status(400).json({message: "User already exists" })
    }

    const tenantExists = await Tenant.findOne({email});

    if(tenantExists){
        return res.status(400).json({message: "Tenant already exists" })
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create Tenant
    const tenant = await Tenant.create({
      businessName,
      email,
      password: hashedPassword
    });

    // create user Account
    const user = await User.create({
      tenantId: tenant._id,
      email,
      password: hashedPassword,
      role
    });


    // const token = jwt.sign(
    //   { userId: user._id, tenantId: tenant._id },
    //   process.env.JWT_SECRET
    // );
    if(user){
        //Authenticate
        generateToken(user._id, tenant._id, res );

          res.status(201).json({
        user:{
            userId: user._id,
            tenantId: user.tenantId,
            role: user.role
        } ,
        message: "User created successfully"
     });
    } else {
        res.status(400).json({message: "Error in saving user data "});
    }

  

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error in register controller" });
  }
};

//Login controller
exports.login = async (req, res) => {
  const { email, password, role = "admin" } = req.body;

  try {
    // check if all fields are filled in
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check email
    const user = await User.findOne({ email });


    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Authenticate
    generateToken(user._id, user.tenantId, res);

          res.status(200).json({
      user: {
            userId: user._id,
            tenantId: user.tenantId,
            role: user.role
      },
      message: "User logged in successfully"
     });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error in login controller" });
  }
};

