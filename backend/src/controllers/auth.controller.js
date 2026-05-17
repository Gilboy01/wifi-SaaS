const bcrypt = require("bcrypt");
const Tenant = require("../models/tenant.model");
const User = require("../models/user.model");
const {generateToken} = require("../lib/utils")


 /*    Register controller   */
exports.register = async (req, res) => {
  const { businessName, name, email, password } = req.body;

  try {
    if (!businessName || !name  || !email || !password){
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
     // check if email exists
    const userExists = await User.findOne({email});
    
    if(userExists){
        return res.status(400).json({message: "User already exists" });
    }
   
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create Tenant / Business
    const tenant = await Tenant.create({
      businessName,
      email
    });

   

    // create Admin user Account
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      tenantId: tenant._id,
    });

    if(user && tenant){
        //Authenticate
        generateToken(user._id, tenant._id, user.role, res );
          res.status(201).json({
        user:{
            userId: user._id,
            name: user.name,
            tenantId: user.tenantId,
            role: user.role
        } ,
        tenant:{
          businessName: tenant.businessName
        },
        message: `${businessName} registered successfully`
     });
    } else {
        res.status(400).json({message: "Error in saving user data "});
    }

  

  } catch (err) {
    console.error("Business & admin Register controller error:", err);
    res.status(500).json({ message: "Error in register controller" });
  }
};

  /* Login controller */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if all fields are filled in
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check email
    const user = await User.findOne({ email }).populate("tenantId");;


    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Authenticate
    generateToken(user._id, user.tenantId, user.role, res);

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

/* Logout controller */ 
exports.logout =  (_,res) => {
    res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({message: "Logged out successfully"});
};

//  get profile
// exports.getProfile = async(req,res) => {
//     try {
//       res.json(req.user);  
//     } catch (error) {
//        res.status(500).json({message: "Server error", error: error.message}); 
//     }
// }

exports.getProfile = async (req, res) => {

  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });

    }

    res.status(200).json({ user});

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};