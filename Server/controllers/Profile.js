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

