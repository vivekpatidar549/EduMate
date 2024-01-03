const RatingAndReview= require('../models/RatingAndReview');
const Course=require('../models/Course');


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
        await Course.findByIdAndUpdate(courseId,{
            $push:{
                ratingAndReviews:ratingReview._id,
            }
        },{new:true});
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
