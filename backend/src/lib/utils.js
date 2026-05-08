const jwt = require("jsonwebtoken") ;


exports.generateToken = (userId, tenantId, res) =>{
    
    // create token
    const JWT_SECRET = process.env.JWT_SECRET;
    if(!JWT_SECRET){
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign({userId, tenantId}, JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, //ms
        httpOnly: true, // prevent XSS attack
        sameSite: "strict", //CRSF attacks prevention
        secure: process.env.NODE_ENV === "development" ? false : true,
    });

    return token;
};

