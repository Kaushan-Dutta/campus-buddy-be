const {yearModel}=require('../Model/StudentModel');
const {usermodel}=require('../Model/UserModel');
const {collegeModel}=require('../Model/AdminModel');
const {UserType}=require('./auth.schema');
const {CollegeType}=require('./college.schema');
const {YearType}=require('./admin.schema')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
} = require("graphql");

const StudentType=new GraphQLObjectType({
    name: "Student",
    fields:()=>({
        _id: { type: GraphQLString },
        user:{
            type:UserType,
            resolve(parent,args){
                return usermodel.findById({ _id:parent.userId})
            }
        },
      
        courses:{ type:GraphQLList(GraphQLString) },
        
    }),

})
module.exports ={StudentType}
