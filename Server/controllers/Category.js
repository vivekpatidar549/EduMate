const Category=require('../models/Categorys');
const mongoose=require('mongoose');
// handler function for create Category

exports.createCategory=async(req,res)=>{
    try{
        //fetch data
        const{name,description}=req.body;
        //validation
        if(!name || !description){
            return res.status(500).json({
                success:false,
                message:"All field are necessary",
            })
        }
        // create entry in db
        const CategoryDetails=await Category.create({name:name,description:description})
        console.log(CategoryDetails);
        return res.status(200).json({
            success:true,
            message:"Category created successfully",
        })
    }catch(error){
         return res.status(404).json({
            success:false,
            message:error.message,
        })(500).json({
            success:false,
            message:error.message,
        })
    }
}

// get all Categorys
exports.showAllCategory=async(req,res)=>{
    try{
        const allCategorys=await Category.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"All Categorys returned successfully",
            allCategorys,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//category page details
exports.categoryPageDetails=async(req,res)=>{
    try{
        //get category id
        const {categoryId}=req.body;
        //get courses for specified category id
        const selectedCategory=await Category.findById(categoryId).populate("courses").exec();
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not found",
            })
        }
        //get courses for different category
        const differentCategories=await Category.find({_id:{$ne:categoryId}}).populate("courses").exec();
         
        //get top 10 selling courses
        //TODO:- 
        //return response
        return res.status(500).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
            }
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}