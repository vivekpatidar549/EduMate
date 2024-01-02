const Section=require('../models/Section');
const Course=require('../models/Course')

//create
exports.createSection=async(req,res)=>{
    try{
        //data fetch
        const {sectionName,courseId}=req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }
        //create section
        const newSection=await Section.create({sectionName});
        // update course
        //TODO :- how can i populate section and subsection
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            
        },{new:true});
        // use populate to replace section/subsection both in the updatecoursedetails
        return res.status(200).json({
            success:true,
            message:"Section Created SuccessFully",
            updatedCourseDetails,
        })
        
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to Create section",
        })
    }
}
//update

exports.updateSection=async(req,res)=>{
    try{
        //data fetch
        const {sectionName,sectionId}=req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }
        //update data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated SuccessFully",
            updatedCourseDetails,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to Update Section",
        })
    }
}
//delete

exports.deleteSection=async(req,res)=>{
    try{
        //data fetch-> assuming tahat we are sendin ID in params
        const {sectionId}=req.params;
        //data validation
        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }
        //delete data
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"Section deleted SuccessFully",
            updatedCourseDetails,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section",
        })
    }
}