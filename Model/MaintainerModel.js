const mongoose=require('mongoose')
require('../connectDb');

const maintainerSchema=new mongoose.Schema({
   userId:{
    type:String,
    ref:'UserModel',
    required:true
   }   
})

const maintainerModel=new mongoose.model('MaintainerModel',maintainerSchema);

module.exports={maintainerModel}