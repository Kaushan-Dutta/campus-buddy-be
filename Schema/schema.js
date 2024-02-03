const {RegisterMutaion,LoginQuery,TokenQuery} =require('./auth.schema')
const {RegisterCollege,GetColleges,GetCollege,GetCourse,GetCourses,GetYears,GetEvents,GetEvent,GetTeacher}=require('./college.schema')
const {ApproveCollege}=require('./maintainer.schema')
const {AddCourse,UploadCourse,AddComment,AddEvent,AddYear}=require('./admin.schema');
const {CreateTest,AttendTest, ReviewTest,CreateSession}=require('./teacher.schema');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLInputObjectType,
} = require("graphql");

const ReplyMessage=new GraphQLInputObjectType({
    name:'ReplyMessage',
    fields:{
        message:{type:GraphQLString}
    }
})

const RootMutation=new GraphQLObjectType({
    name:'RootMutation',
    fields:{
        RegisterMutaion,
        RegisterCollege,
        ApproveCollege,
        AddCourse,
        UploadCourse,
        AddEvent,
        AddComment,
        CreateTest,
        AttendTest,
        ReviewTest,
        CreateSession,
        AddYear
    }
})

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
          TokenQuery,
          LoginQuery,
          GetColleges,
          GetCollege,
          GetCourse,
          GetCourses,
          GetYears,
          GetEvents,
          GetEvent,
          GetTeacher
    }
})
module.exports=new GraphQLSchema({
    query:RootQuery,
    mutation:RootMutation
})
//GetCourses
//GetYears
//GetSessions & GetUploads & GetTest
//GetStudent teacher admin

