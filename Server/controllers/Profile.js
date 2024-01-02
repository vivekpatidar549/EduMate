const Profile=require('../models/Profile');
const User=require('../models/user');
exports.updateProfile=async(req,res)=>{
    try{
        //TODo:- schedule request like 5 day after account will delete
        //get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        //get id
        const id=req.user.id;
        //validation
        if(!contactNumber || !gender ||!id){
            return res.status(500).json({
                success:false,
                message:"All fields are required",
            })
        }
        //find and updation
        const userDetails=await User.findById(id);
        const profileID=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileID);
        //updation
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();
        
        //return response
        return res.status(200).json({
            success:false,
            message:" Profile Updated Successfully",
            profileDetails,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error While Updating Profile",
        })
    }
}


exports.deleteAccount=async(req,res)=>{
    try{
        //get id
        const id=req.user.id;
        const userDetails=await User.findById(id);
        //validation
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"USer not Found",
            })
        }
        // delete profile:- how to schedule it 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        //TODO :- unenroll user from all enrolled courses, what is cronjob
        // delete user
        await User.findByIdAndDelete({_id:id});
        
        //response
        return res.status(200).json({
            success:false,
            message:" Account deleted Successfully",
            profileDetails,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error While deleting Account",
        })
    }
}

exports.getUserDetails=async(req,res)=>{
    try{
        //id
        const id=req.user.id;
        // validation
        const userDetails= await User.findById(id).populate("additionalDetails").exec();
        //response
        return res.status(200).json({
            success:false,
            message:" USer data fetched Successfully",
            userDetails,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error While fetching Account Details",
        })
    }
}