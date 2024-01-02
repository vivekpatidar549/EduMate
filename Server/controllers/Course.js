const Course=require('../models/Course');
const Tag=require('../models/Tags');
const User=require('../models/user');
const {uploadImageToCloudinary}=require('../utilities/imageUploader');


//create course
exports.createCourse=async(req,res)=>{
    try{
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;
        //get thumbnail
        const thumbnail=req.files.thumbnailImage;
        //validation
        if(!courseName|| !courseDescription || !whatYouWillLearn|| !price|| !tag){
            return res.status(500).json({
                success:false,
                message:"All fields are required",
            })
        }
        // check for instructor
        const userId=req.user.id;
        const instructorDetails=await User.findOne({userId});
        console.log("instructorDetails",instructorDetails);
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Not Found",
            })
        }
        // check given tag is valid or not
        const tagDetails=await Tag.findById(tag);
        if(!tagDetails){
            return res.status(500).json({
                success:false,
                message:"Tag details not found",
            })
        }
        // upload image to cloudinary
        const thumbnailImage=uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        //create an entry for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })
        // update instructor detail by adding that course
        await User.findByIdAndUpdate({_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },{new:true});

        //update tag schema 
        return res.status(200).json({
            success:false,
            message:"Course created Successfully",
            newCourse,
        })   
        
    }catch(error){
        return res.status(404).json({
            success:false,
            message:error.message,
        })
    }
}


// get all courses

exports.showAllCourses=async(req,res)=>{
    try{
        const allCourses=await Course.find({},{courseName:true,price:true,thumbnail:true,instructor:true,ratingAndReviews:true,studentsEnrolled:true}).populate("Instructor").exec();
        return res.status(200).json({
            success:true,
            message:"data from courses fetched successfully",
            data:allCourses,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Can not fetch course data",
            error:error.message,
        })
    }
}