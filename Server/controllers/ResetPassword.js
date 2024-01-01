const User=require('../models/user');
const mailSender=require('../utilities/mailSender');




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
    // data fetch
    //validation
    // get userdetails from db using token
    // if no entry ->invalid token / or token expires
    //hash password
    //update password
    //return response
}