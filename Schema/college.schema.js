const { eventModel,discussionModel,collegeModel } = require("../Model/AdminModel.js");
const {CourseType,NotificationType}=require('./admin.schema');
const {courseModel,yearModel}=require('../Model/StudentModel');
const {UserType}=require('./auth.schema');
const {teacherModel} =require('../Model/TeacherModel.js')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean
} = require("graphql");
const { userModel } = require("../Model/UserModel.js");

const CollegeType = new GraphQLObjectType({
  name: "College",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email:{ type: GraphQLString },
    phone:{ type: GraphQLString },
    website: { type: GraphQLString },
    address: { type: GraphQLString },
    documentProof: { type: GraphQLString },
    status: { type: GraphQLString },
    events: {
      type: NotificationType,
      resolve(parent, args) {
        return eventModel.find({ collegeId: parent._id });
      },
    },
  }),
});

const DiscussionType = new GraphQLObjectType({
  name: "Discussion",
  fields: () => ({
    _id: { type: GraphQLString },
    comment: { type: GraphQLString },
    date: { type: GraphQLString },
    postedBy: { type: GraphQLString },
    date: { type: GraphQLString },

    parent: {
      type: DiscussionType,
      resolve(parent, args) {
        return discussionModel.find({ parent: parent._id });
      },
    },
  }),
});
const YearType=new GraphQLObjectType({
  name:'Years',
  fields:()=>({
    _id:{type:GraphQLString},
    collegeId:{type:GraphQLString}
  })
})
const RegisterCollege={
  type:CollegeType,
  args:{
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    phone: { type: GraphQLString },
    website: { type: GraphQLString },
    address: { type: GraphQLString },
    documentProof: { type: GraphQLString },
  },
  async resolve(parent,args){
    try{
      const register=new collegeModel({email:args.email,phone:args.phone,website:args.website,
        address:args.address,documentProof:args.documentProof,name:args.name})
      return await register.save()
    }
    catch(e){
      return new Error(e);
    }
  }
}
const GetColleges={
  type:new GraphQLList(CollegeType),

  async resolve(parent,args){
    try{
      return await collegeModel.find({})
    }
    catch(e){
      return new Error(e);
    }
  }
}
const GetCollege={
  type:CollegeType,
  args:{
    _id:{type:GraphQLString
  }},
  async resolve(parent,args){
    try{
      return await collegeModel.findOne({_id:args._id})
    }
    catch(e){
      return new Error(e);
    }
  }
}
const GetCourses={
  type:new GraphQLList(CourseType),
  args:{yearId:{type:GraphQLString},collegeId:{type:GraphQLString}},
  async resolve(parent,args){
    try{
      return await courseModel.find({collegeId:args.collegeId,yearId:args.yearId})
    }
    catch(e){
      return new Error(e);
    }
  }
}
const GetCourse={
  type: CourseType,
  args:{_id:{type:GraphQLString}},
  async resolve(parent,args){
    console.log(args._id);
    try{
      return await courseModel.findById({_id:args._id})
    }
    catch(e){
      return new Error(e);
    }
  }
}

const GetYears={
  type: new GraphQLList(YearType),
  args:{collegeId:{type:GraphQLString}},
  async resolve(parent,args){
    try{
      return await yearModel.find({collegeId:args.collegeId})
    }
    catch(e){
      return new Error(e);
    }
  }
}
const GetEvents={
  type:new GraphQLList(NotificationType),
  args:{collegeId:{type:GraphQLString}},
  async resolve(parent,args){
    try{
      console.log("////////////////",args.collegeId)
      return await eventModel.find({collegeId:args.collegeId})
    }
    catch(e){
      return new Error(e);
    }
  }
}
const GetEvent={
  type:NotificationType,
  args:{_id:{type:GraphQLString}},
  async resolve(parent,args){
    try{
      console.log(args._id)
      return await eventModel.findById({_id:args._id})
    }
    catch(e){
      return new Error(e);
    }
  }
}
const GetTeacher={
  type:UserType,
  args:{courseId:{type:GraphQLString}},
  async resolve(parent,args){
    try{
      console.log(args.courseId)
      const teacher=await teacherModel.findOne({courseId:args.courseId});
      console.log(teacher);
      if(teacher){
        return await userModel.findById({_id:teacher.userId});
      }
    } 
    catch(e){
      return new Error(e);
    }
  }
}
module.exports={RegisterCollege,CollegeType,GetColleges,GetCollege,GetCourse,GetCourses,GetYears,GetEvents,GetEvent,GetTeacher}
