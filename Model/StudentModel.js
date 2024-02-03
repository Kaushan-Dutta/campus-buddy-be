const mongoose=require('mongoose')
require('../connectDb');

const studentSchema=new mongoose.Schema({
    
   userId:{
    type:String,
    ref:'UserModel',
    required:true
   },
   

   yearId:{
    type:String,
    ref:'YearModel',
    required:true
   },
   

})
const courseSchema=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
   
    materials:{
        type:[{
            url:{
                type:String},
            topic:{
                type:String
            }
        }]
    },
    collegeId:{
        type:String,
        ref:'CollegeModel',
        required:true
    },
    yearId:{
        type:String,
        ref:'YearModel',
        required:true
    }
})
const yearSchema=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    collegeId:{
        type:String,
        ref:'CollegeModel',
        required:true
    },
})
const studentModel=new mongoose.model('StudentModel',studentSchema);
const courseModel=new mongoose.model('CourseModel',courseSchema);
const yearModel=new mongoose.model('YearModel',yearSchema);

module.exports={studentModel,courseModel,yearModel}