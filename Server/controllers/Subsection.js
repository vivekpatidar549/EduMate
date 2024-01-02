const Section=require('../models/Section');
const { uploadImageToCloudinary } = require('../utilities/imageUploader');
const SubSection = require('../models/SubSection');

//create
exports.createSubSection=async(req,res)=>{
    try{
        //fetch data from req body
        const {sectionId,title,description,timeDuration}=req.body;
        //extract file
        const video=req.files.videoFile;
        //validation
        if(!video || !sectionId || !title || !description || !timeDuration){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //upload video to cloudinary
       const uploadDetails= await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        //create subsection
        const subsectionDetails=await SubSection.create({title:title,timeDuration:timeDuration,description:description,videoUrl:uploadDetails.secure_url});

        //add that sub section id to section
        const updatedSection=await Section.findByIdAndUpdate(sectionId,{
            $push:{
                SubSection:subsectionDetails._id,
            }
        },{new:true});
        //TODO:- log updates section here, after adding populated query

        //return response
        return res.status(200).json({
            success:true,
            message:"SUb-Section Created SuccessFully",
            updatedSection,
        })
    }catch(error){
        return res.status(500).json({
            success:true,
            message:"Internal error while creating sub section",
            updatedCourseDetails,
        })
    }
}


//Update Subsection
exports.updateSubSection=async(req,res)=>{
    try{
        
    }catch(error){
        return res.status(500).json({
            success:true,
            message:"Internal error while updating sub section",
            updatedCourseDetails,
        })
    }
}


// delete Subsection

exports.deleteSubSection=async(req,res)=>{
    try{
        
    }catch(error){
        return res.status(500).json({
            success:true,
            message:"Internal error while deleting sub section",
            updatedCourseDetails,
        })
    }
}