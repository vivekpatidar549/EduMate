const User=require('../models/user');
const OTP=require('../models/OTP');
const otpGenerator=require('otp-generator');
const Profile=require('../models/Profile');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();

// sendOTP  it create otp and store in db
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
exports.signUp=async(req,res)=>{
    try{
        //data fetch
        const{firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp}=req.body;
        //validate data
        if(!firstName || !lastName || !email|| !password|| !confirmPassword|| !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        // match password
        if(password !==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passowrd does not match",
            })
        }
        // check user exits or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already registered",
            })
        }
        // find most recent otp stored from db
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        // createdAt:-1  This is the sorting criterion. It indicates that the documents should be sorted based on the createdAt field in descending order, 
        // means we will get most recent entry and also limit(1):-  This limits the number of documents returned to just one.
        // validate otp
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"OTP Not Found",
            })
        }
        else if(otp!==recentOtp.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }
        // hash passowrd
        const hashedPassword=await bcrypt.hash(password,10);
        // create entry in db
        const profileDetails=await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null});
        const user=await User.create({firstName,lastName,email,password:hashedPassword,accountType,contactNumber,additionalDetails:profileDetails._id,image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`});
        //return res
        return res.status(200).json({
            success:true,
            message:"User Registered successfully",
            user,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User can not be registered Please try again",
        })
    }
}

// login 

exports.login=async(req,res)=>{
    try{
        // get data from req body
        const {email,password}=req.body;
        // validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            });
        }
        // user exist or not
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered",
            });
        }
        //match password && token generate JWT
        
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user.id,
                role:user.role,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            user.token=token;
            user.password=undefined;

            const options={
            expires:new Date (Date.now()+ 3*24*60*60*1000),
            httpOnly:true,
            }
            // create cookie and send response
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"logged in Successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Passowrd is Incorrect",
            });
        }
        
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure Please try again",
        });
    }
}



// change password

