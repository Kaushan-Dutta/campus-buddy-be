const mongoose=require('mongoose')

const {GenerateUserId}=require('../Middleware/user.logic.js')
require('../connectDb');

const userSchema=new mongoose.Schema({
    _id:{
        type:String,
    },
    password:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    collegeId:{
        type:String,
        ref:'CollegeModel',
    },
    entity:{
        type:String,
        required:true,
        enum:['maintainer','admin','student','teacher']
    }
    
})
userSchema.pre('save',async function(next){
    let regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(this.entity==='admin'){
        this.password='Admin@123'
    }
    else if(this.entity==='student'){
        this.password='Student@123'
    }
    else if(this.entity==='teacher'){
        this.password='Teacher@123'
    }
    console.log(this.password,this.entity,this._id)
    if (!regPass.test(this.password)) {
      return next(new Error('Invalid Password'));
    }

    if (!regEmail.test(this.email)) {
      return next(new Error('Invalid Email'));
    }
    if(String(this.phone).length > 10) {
       return next(new Error('Invalid Phone Number'));
    }
    this._id=String(GenerateUserId());

    next();
})
const userModel=new mongoose.model('UserModel',userSchema);

module.exports={userModel}