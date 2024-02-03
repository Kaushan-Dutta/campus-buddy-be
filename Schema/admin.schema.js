const { userModel } = require("../Model/UserModel");
const { collegeModel } = require("../Model/AdminModel");
const { adminModel,eventModel,discussionModel } = require("../Model/AdminModel");
const {
  studentModel,
  courseModel,
  yearModel,
} = require("../Model/StudentModel");
const {UserType}=require("./auth.schema");
const {SessionType,TestType}=require("./teacher.schema");
const {sessionModel,teacherModel,testModel}=require('../Model/TeacherModel');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
} = require("graphql");

const AdminType = new GraphQLObjectType({
  name: "Admin",
  fields: () => ({
    _id: { type: GraphQLString },

    admin: {
      type: UserType,
      resolve(parent, args) {
        return userModel.findById(parent.userId);
      },
    },
    college: {
      type: CollegeType,
      resolve(parent, args) {
        return userModel.findById(parent.collegeId);
      },
    },
  }),
});
const DiscussionType = new GraphQLObjectType({
  name: "DiscussionType",
  fields: () => ({
    _id: { type: GraphQLString },
    comment: { type: GraphQLString },
    date: { type: GraphQLString },
    postedBy: { type: GraphQLString },
    parent: { type: GraphQLString },
  }),
})

const NotificationType = new GraphQLObjectType({
  name: "NotificationType",
  fields: () => ({
    _id: { type: GraphQLString },
    collegeId: { type: GraphQLString },
    event: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    date: { type: GraphQLString },
    comments: {
      type: new GraphQLList(DiscussionType),
      resolve(parent, args) {
        return discussionModel.find({ eventId: parent._id });
      },
    },
  }),
});
const YearType = new GraphQLObjectType({
  name: "Year",
  fields: () => ({
    _id: { type: GraphQLString },
    collegeId: { type: GraphQLString },
  }),
});
const MaterialType=new GraphQLObjectType({
  name:"MaterialType",
  fields:{
    url:{type:GraphQLString},
    topic:{type:GraphQLString}
  }
})
const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    _id: { type: GraphQLString },
    course: { type: GraphQLString },
    materials: { type: GraphQLList(MaterialType) },
    collegeId: { type: GraphQLString },
    yearId: { type: GraphQLString },
    teacher:{
      type:UserType,
      async resolve(parent,args){
        const teacher=await teacherModel.findOne({courseId:parent._id});
        //console.log(teacher)
        return await userModel.findOne({_id:teacher.userId}); 
      }
    },
    sessions:{
      type: new GraphQLList(SessionType),
      resolve(parent,args){
        return sessionModel.find({courseId:parent._id});
      }
    },
    tests:{
      type: new GraphQLList(TestType),
      resolve(parent,args){
        return testModel.find({courseId:parent._id});
      }
    },
    
  }),
});
const AddYear = {
  type: YearType,
  args: {
    _id: { type: GraphQLString },
    collegeId: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const year = new yearModel({ _id: args._id,collegeId:args.collegeId });
    return await year.save();
  },
};
const AddCourse = {
  type: CourseType,
  args: {
    _id:{type:GraphQLString},
    course: { type: GraphQLString },
    collegeId: { type: GraphQLString },
    yearId: { type: GraphQLString },
  },
  async resolve(parent, args) {
    console.log(`Adding ${args.course}`);
    const course = new courseModel({_id:args._id, course: args.course,collegeId:args.collegeId,yearId:args.yearId });
    return await course.save();
  },
};
const UploadCourse = {
  type: CourseType,
  args: {
    _id: { type: GraphQLString },
    url: { type: GraphQLString },
    topic:{type:GraphQLString}
  },
  async resolve(parent, args) {
    const addCourse = await courseModel.findById({ _id: args._id });
    addCourse.materials.push({url:args.url,topic:args.topic});
    return await addCourse.save();
  },
};
const AddEvent={
  type:NotificationType,
  args:{
    collegeId:{type:GraphQLString},
    event:{type:GraphQLString},
    description:{type:GraphQLString},
    image:{type:GraphQLString},
    date:{type:GraphQLString}
  },
  async resolve(parent,args){
    const event=new eventModel({collegeId:args.collegeId,event:args.event,description:args.description,
      image:args.image,date:args.date})
    return await event.save();
  } 
}
const AddComment={
  type:DiscussionType,
  args:{
    eventId:{type:GraphQLString},
    comment:{type:GraphQLString},
    postedBy:{type:GraphQLString},
    parent:{type:GraphQLString}
  },
  async resolve(parent,args){
    const comment=new discussionModel({eventId:args.eventId,comment:args.comment,postedBy:args.postedBy,parent:args.parent
    });
    
    return await comment.save();

  }
}
module.exports = { AdminType,CourseType, YearType, AddYear, AddCourse, UploadCourse ,AddEvent,AddComment,NotificationType};
