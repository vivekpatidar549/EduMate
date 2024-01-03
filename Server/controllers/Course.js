const Course=require('../models/Course');
const Category=require('../models/Category');
const User=require('../models/user');
const {uploadImageToCloudinary}=require('../utilities/imageUploader');


//create course
exports.createCourse=async(req,res)=>{
    try{
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,category}=req.body;
        //get thumbnail
        const thumbnail=req.files.thumbnailImage;
        //validation
        if(!courseName|| !courseDescription || !whatYouWillLearn|| !price|| !category){
            return res.status(500).json({
                success:false,
                message:"All fields are required",
            })
        }
        // check for instructor
        const userId=req.user.id;
        const instructorDetails=await User.findOne({userId});
        console.log("instructorDetails",instructorDetails);
        // TODO:- verify that userID and InstructorID same or different
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Not Found",
            })
        }
        // check given category is valid or not
        const categoryDetails=await Category.findById(category);
        if(!categoryDetails){
            return res.status(500).json({
                success:false,
                message:"Category details not found",
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
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })
        // update instructor detail by adding that course
        await User.findByIdAndUpdate({_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },{new:true});

        //update category schema 
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

exports.getAllCourses=async(req,res)=>{
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


// get course details

exports.getCourseDetails=async(req,res)=>{
    try{
        const {courseId}= req.body;
        // find course detail
        const CourseDetails= await Course.find({_id:courseId}).populate(
            {
                path:"Instructor",
                populate:{
                    path:"additionalDetails",
                }
            }
            .populate("Category")
            .populate("ratingAndReviews")
            .populate({
                path:"courseContent",
                populate:{
                    path:"SubSection",
                }
            })
            .exec()
        )

        if(!CourseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with id ${courseId}`,
            })
        }
        return res.status(200).json({
            success:true,
            message:"Course details fetched successfully"
        })
        
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}