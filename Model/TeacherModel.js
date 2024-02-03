const mongoose=require('mongoose')
require('../connectDb');

const teacherSchema=new mongoose.Schema({
   userId:{
    type:String,
    ref:'UserModel',
    required:true
   },
   
         
   courseId:{
    type:String,
    ref:'CourseModel',
    required:true
   },

})
const sessionSchema=new mongoose.Schema({
   courseId:{
      type:String,
      ref:'CourseModel',
      required:true
   },
   link:{
      type:String,
      required:true
   },
   date:{
      type:Date,
      required:true
   },
   startTime:{
      type:String,
      required:true
   }
})
const testSchema=new mongoose.Schema({
   courseId:{
      type:String,
      ref:'CourseModel',
      required:true
   },
   link:{
      type:String,
      required:true
   }
})
const testReportSchema=new mongoose.Schema({
   testId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'TestReportModel',
      required:true
   },
   studentId:{
      type: String,
      ref:'StudentModel',
      required:true
   },
  
   marks:{
      type:Number
   },
   isChecked:{
      type:Boolean,
      default:false
   }
})
const teacherModel=new mongoose.model('TeacherModel',teacherSchema);
const testModel=new mongoose.model('TestModel',testSchema);
const testReportModel=new mongoose.model('TestReportModel',testReportSchema);
const sessionModel=new mongoose.model('SessionModel',sessionSchema);

module.exports={teacherModel,testModel,testReportModel,sessionModel}