const {instance} = require('../config/razorpay');
const User=require('../models/user');
const Course=require('../models/Course');
const mailSender=require('../utilities/mailSender');
const {courseEnrollmentEmail}=require('../mail/templates/courseEnrollment');
const { default: mongoose } = require('mongoose');
require('dotenv').config();


//capture the payment and intitiate the razorpay order

exports.capturePayment=async(req,res)=>{
    try{
        // get course and user id
        const {course_id}=req.body;
        const userId=req.user.id;
        //validation
        if(!course_id){
            return res.json({
                success:false,
                message:"Please provide valid course id"
            })
        }
        // valid course id
        let course=await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"Could not find course"
            })
        }
        //user already paid for course
        const uid=new mongoose.Types.ObjectId(userId); // converting user id which was in string in object id
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student already enrolled"
            })
        }
        //create order & return response

        const amount=course.price;
        const currency="INR";

        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now().toString()),
            notes:{
                course_id,
                userId,
            }
        };
        try{

            //initiate the payment using razorpay
            const paymentResponse=await instance.orders.create(options);
            console.log(paymentResponse);
            return res.status(200).json({
                success:false,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount, 
                message:"Order created successfully"

            })
        }catch(error){
            console.log(error);
            return res.json({
                success:false,
                message:"Could not initiate order"
            })
        } 
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//verify signature of razorpay and Server
exports.verifySignature=async(req,res)=>{
    const webHookSecret="12345678";
    const signature=req.headers("x-razorpay-signature");
    const shasum=crypto.createHmac("sha256",webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");
    if(signature==digest){
        console.log("payment is Authorized");
        const  {userId,courseId}= req.body.payload.payment.entity.notes;
        try{
            //enroll student
            const enrolledCourse=await Course.findOneAndUpdate({_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true});
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found",
                })
            }    
            console.log(enrolledCourse);

            // find student and add course to list of enrolled courses
            const enrolledStudent=await User.findOneAndUpdate({_id:userId},
                {$push:{courses:courseId}},{new:true});

            console.log(enrolledStudent);

            // send mail

            const emailResponse =await mailSender(
                enrolledStudent.email,
                "Congratulations, You are onboarded into new",
                "congrats",
            )
        }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }

}
