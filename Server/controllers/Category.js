const Category=require('../models/Categorys');

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


exports.categoryPageDetails=async(req,res)=>{
    try{

    }catch(error){
        
    }
}