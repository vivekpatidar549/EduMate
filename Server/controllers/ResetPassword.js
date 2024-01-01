const user = require('../models/user');
const User=require('../models/user');
const mailSender=require('../utilities/mailSender');
const bcrypt=require('bcrypt');



// reset Password token
exports.resetPasswordToken=async(req,res)=>{
    try{
        // email getting from req body
        const {email}=req.body;
        //check email validation
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(403).json({
                success:false,
                message:"your email is not registered with us",
            })
        }
        //generate token
        const token=crypto.randomUUID()
        // update user by adding token adn expiration time 
        const updatedDetails=await User.findByIdAndUpdate({email:email},{
            token:token,
            resetPasswordExpires:Date.now()+5*60*1000,
        },{new:true})
        //create url
        const url=`http:localhost:3000/update-password/${token}`
        //send mail containing url
        await mailSender(email,"Password Reset Link",`Password reset link:- ${url}`)
        //return response
        return res.json({
            success:true,
            message:"email sent successfully, please check your mail and set password"
        })

        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while sending reset password mail",
        })
    }
}


// reset password

exports.resetPassword=async(req,res)=>{
    try{
    // data fetch
    const {password,confirmPassword,token}=req.body;
    //validation
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:"Password not matching",
        })
    }
    // get userdetails from db using token
    const userDetails=await User.findOne({token:token});
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token invalid",
        })
    }
    if(userDetails.resetPasswordExpires<Date.now()){
        return res.json({
            success:false,
            message:"Request time out, TOken expired regenate token",
        })
    }
    // if no entry ->invalid token / or token expires
    //hash password
    const hashpassword=await bcrypt.hash(password,10);
    //update password
    await User.findOneAndUpdate({token},{
        password:hashpassword,
    },{new:true}) // this line return the new updated document
    //return response
    return res(200).json({
        success:true,
        message:"Password reset Successfull",
    })
    }catch(error){
        return res.json({
            success:false,
            message:"Request time out, TOken expired regenate token",
        })
    }
    
}