const mongoose=require('mongoose');
require('dotenv').config();
exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{console.log("db connected successfully");})
    .catch((error)=>{
        console.log("Db COnnection Failed");
        console.error(error);
        process.exit(1);
    })
};