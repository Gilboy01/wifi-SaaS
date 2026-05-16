const bcrypt = require("bcrypt");

const User = require("../models/user.model");

exports.createStaff =  async (req, res) => {

  try {
    // only admin
    const admin = req.user;

    const {
      name,
      email,
      password
    } = req.body;

    // check if all fields are filled in
    if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required"})
    }

    if (password.length < 6){
            
        return res.status(400).json({message:"Password must be atleast 6 characters"});
        }
        
    // check if email is valid: regex
    const emailRegex  = /^[^@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
            
        return res.status(400).json({message:"Invalid email format"});
        }

        // check email
    const existingUser = await User.findOne({email});

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create staff user
    const staff = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "staff",
        tenantId: admin.tenantId
      });

    res.status(201).json({
      success: true,
      message: `${staff.name} created successfully`,
      staff
    });
} catch(err){
console.log("error creating staff", err);
res.status(500).json({
    success: false,
    message: "Error in creating staff user"
})
}

}


    

