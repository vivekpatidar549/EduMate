const User=require('../models/user');
const OTP=require('../models/OTP');
const otpGenerator=require('otp-generator');

// sendOTP
exports.sendOTP=async(req,res)=>{
    try{
            // fetch email from req. body
    const {email}=req.body;
    // check if user already exists
    const checkUSerPresent=await User.findOne({email});
    if(checkUSerPresent){
        return  res.status(401).json({
            success:false,
            message:"user already registered",
        })
    }
    // generate otp
    var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("Generated otp->",otp);
    // check if otp is unique
    let result =await OTP.findOne({otp:otp});
    // while non unique is coming generate new
    while(result){
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result=await OTP.findOne({otp:otp});
    }
    const otpPayload={email,otp};
    // create an entry in DB
    const otpBody=OTP.create(otpPayload);
    console.log(otpBody);
     // return response successfully
     res.status(200).json({
        success:true,
        message:"OTP Sent Successfully",
     })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}


//sign up


// login 



// change password

