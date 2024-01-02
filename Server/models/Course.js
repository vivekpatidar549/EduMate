const mongoose=require('mongoose');


const CourseSchema= new mongoose.Schema({
     courseName:{
        type:String,
     },
     courseDescription:[{
        type:String,
     }], 
     instructor:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
     }, 
     whatYouWillLearn:{
        type:String,
     },
     courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
     }],
     ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
     }],
     price:{
        type:Number,
     },
     thumbnail:{
        type:String,
     },
     category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
     },
     studentsEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
     },
     tag:{
         type:[String],
         required:true,
     },
     status:{
      type:String,
      enum:["Draft","Published"],
     }

});
module.exports=mongoose.model("Course",CourseSchema);