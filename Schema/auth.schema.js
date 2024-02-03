const { userModel } =require( "../Model/UserModel");
const { adminModel } =require( "../Model/AdminModel");
const { studentModel } =require( "../Model/StudentModel");
const {teacherModel } =require( "../Model/TeacherModel");
const { GenerateToken, MatchToken }=require('../Middleware/user.logic.js')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLNumber,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType
} = require("graphql");

const AdminType = new GraphQLInputObjectType({
  name: "AdminType",
  fields: {
    userId: { type: GraphQLString },
  },
});
const MemberType = new GraphQLObjectType({
  name: "Member",
  fields: {
    yearId: { type: GraphQLString },
    userId: { type: GraphQLString },
    courseId: { type: GraphQLString },
  },
});
const MemberInputType = new GraphQLInputObjectType({
  name: "MemberInputType",
  fields: {
    yearId: { type: GraphQLString },
    courseId:{type:GraphQLString},
  },
});
async function createAdmin(_id) {
   const newEntity= new adminModel({userId:_id})
   return await newEntity.save()
  }
async function createStudent(details,_id) {
  const newEntity= new studentModel({userId:_id,yearId:details.yearId})
  return await newEntity.save()
}
async function createTeacher(details,_id) {
  const newEntity= new teacherModel({userId:_id,courseId:details.courseId})
  return await newEntity.save()
}
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    entity: { type: GraphQLString },
    collegeId: { type: GraphQLString },
    accessToken: { type: GraphQLString },
    details: {
      type: MemberType,
      resolve(parent, args) {
        console.log(parent.entity);
        switch (parent.entity) {
          case 'admin':
            return adminModel.findOne({ userId: parent._id });
          case 'student':
            return studentModel.findOne({ userId: parent._id });
          case 'teacher':
            return teacherModel.findOne({ userId: parent._id });
          default:
            return null; 
        }
      },
    },
  }),
});

const LoginQuery = {
  type: UserType,
  args: { _id: { type: GraphQLString }, password: { type: GraphQLString } },
  async resolve(parent, args) {
    const getUser =await userModel.findById({ _id: args._id });
    if (getUser) {
      if (getUser.password == args.password) {
         const createToken=GenerateToken({_id:getUser._id,email:getUser.email,phone:getUser.phone,entity:getUser.entity,collegeId:getUser.collegeId});
         console.log(createToken);
         return {accessToken:createToken}
      }
    }
    new Error("Invalid userid or password");
  },
};
const TokenQuery = {
  type: UserType,
  args: { token: { type: GraphQLString } },
  async resolve(parent, args) {
    try{

    const user=MatchToken(args.token);
    return await userModel.findById({ _id: user._id });}
    catch(err){
      console.log(err.message);
    }
  },
};

const RegisterMutaion = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    collegeId:{type:GraphQLString},
    phone: { type: GraphQLString },
    entity: { type: GraphQLString },
    details:{type:MemberInputType  },
  },
  async resolve(parent, args) {
    try {
      console.log(args.phone,args.details);
      const createUser = new userModel(
        {
         email: args.email ,
         phone: args.phone ,
         entity: args.entity,
         collegeId: args.collegeId},
        
      );
      console.log(createUser)
      await createUser.save();
      if(args.entity=='admin'){
        createAdmin(createUser._id) 
      }
      else if(args.entity=='student'){
        createStudent(args.details,createUser._id) 
      }
      else if(args.entity=='teacher'){
        createTeacher(args.details,createUser._id) 
      }
      return createUser
    } catch (err) {
      console.log("Error is",err);
    }
  },
};
module.exports={UserType,LoginQuery,RegisterMutaion,TokenQuery}