const RatingAndReview= require('../models/RatingAndReview');
const Course=require('../models/Course');
const { default: mongoose } = require('mongoose');


//create rating
exports.createRating=async(req,res)=>{
    try{
        // get user id
        const userId=req.user.id; 
        // fetch data from req id
        const {rating, review,courseId}=req.body;
        // check is user is enrolled or not && check if user already reviewed   // eleMatch=element match  // eq means equal 
        const CourseDetails= await Course.findOne({_id:courseId, studentsEnrolled:{$eleMatch:{$eq:userId}}});
        
        if(!CourseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is Not enrolled in course",
            })
        }
        const alreadyReviewed=await RatingAndReview.findOne({user:userId, course:courseId})

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is Already reviewed by the user",
            })
        }
        //create rating and review
        const ratingReview =await RatingAndReview.create({rating,review,course:courseId,user:userId});
        //update course with this rating and review
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,{
            $push:{
                ratingAndReviews:ratingReview._id,
            }
        },{new:true});
        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success:false,
            message:"Rating Review Created Successfully",
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error While Creating rating",
        })
    }
}




// get avg rating

exports.getAverageRating=async(req,res)=>{
    try{
        // get course id
        const courseId=req.body.courseId;
        // calculate avg rating
        const result= await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },{
                $group:{
                    _id:null,  // no criteria to group
                    averageRating:{$avg:"$rating"},   // finding average
                }
            }
        ])

        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        return res.status(200).json({
            success:true,
            message:"Average rating is 0, no rating is given till now",
            averageRating:0,
        })

        //return avg rating
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error While Creating rating",
        })
    }
}
