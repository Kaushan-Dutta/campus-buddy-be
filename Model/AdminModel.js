const mongoose=require('mongoose')
const {GenerateCollegeId}=require('../Middleware/user.logic')
require('../connectDb');

const adminSchema=new mongoose.Schema({
   userId:{
    type:String,
    ref:'UserModel',
    required:true
   },
   
})

const collegeSchema=new mongoose.Schema({
    _id:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    documentProof:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    },

})
collegeSchema.pre('save',async function(next){
    this._id=String(GenerateCollegeId());
    if(String(this.phone).length > 10) {
       return next(new Error('Invalid Phone Number'));
    }
})
const eventSchema=new mongoose.Schema({

    collegeId:{
        type:String,
        ref:'CollegeModel',
        required:true
    },
    event:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    date:{
        type:String,
    },

})
const discussionSchema=new mongoose.Schema({
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'EventModel',
        required:true
    },
    comment:{type:String},
    date:{
        type:String,default:()=>{
        const date=new Date();
        return date.getMonth()+"/"+date.getDate()+"/"+date.getFullYear();
    }},
    postedBy:{
        type:String,ref:'UserModel'},
    parent:{type:mongoose.Schema.Types.ObjectId,ref:'DiscussionModel'},
    
})

const adminModel=new mongoose.model('AdminModel',adminSchema);
const collegeModel=new mongoose.model('CollegeModel',collegeSchema);
const eventModel=new mongoose.model('EventModel',eventSchema);
const discussionModel=new mongoose.model('DiscussionModel',discussionSchema);

module.exports={adminModel,collegeModel,eventModel,discussionModel}