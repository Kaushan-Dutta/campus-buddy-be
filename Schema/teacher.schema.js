const {yearModel,studentModel}=require('../Model/StudentModel');
const {usermodel}=require('../Model/UserModel');
const {collegeModel}=require('../Model/AdminModel');
const {teacherModel,testModel,testReportModel,sessionModel}=require('../Model/TeacherModel');
const {courseModel} =require('../Model/StudentModel');
const {CourseType}=require('./admin.schema')
const {StudentType}=require('./student.schema')
const {ReplyMessage}=require('./input.schema')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
} = require("graphql");

const TeacherType=new GraphQLObjectType({
    name: "Teacher",
    fields:()=>({
        _id: { type: GraphQLString },
        user:{
            type:UserType,
            resolve(parent,args){
                return usermodel.findById({ _id:parent.userId})
            }
        },
        college:{
            type:CollegeType,
            resolve(parent,args){
                return collegeModel.findById({_id:parent.collegeId})
            }
        },
        
        courses:{ type: GraphQLString },
        
    }),

})
const TestType=new GraphQLObjectType({
    name:'Test',
    fields:()=>(
        {
            _id:{ type: GraphQLString },
            
            link:{ type: GraphQLString }
        }
    )
})
const TestReportType=new GraphQLObjectType({
    name:'TestReport',
    fields:()=>(
        {
            _id:{ type: GraphQLString },
            test:{
                type:TestType,
                resolve(parent,args){
                    return testModel.findById({ _id:parent.testId})
                }
            },
            student:{
                type:StudentType,
                resolve(parent,args){
                    return studentModel.findById({ _id:parent.studentId})
                }
            },
         
            marks:{ type: GraphQLInt },
            isChecked:{ 
                type: GraphQLBoolean,
            }
        }
    )
})
const SessionType=new GraphQLObjectType({
    name: 'Session',
    fields:()=>(
        {
            _id:{ type: GraphQLString },
            
            link:{ type: GraphQLString },
            date:{ type: GraphQLString },
            startTime:{ type: GraphQLString }
        }
    )
})
const CreateTest={
    type:TestType,
    args:{courseId:{type:GraphQLString},link:{type:GraphQLString}},
    async resolve(parent,args){
        const create=new testModel({courseId:args.courseId,link:args.link});
        return await create.save();
    }
}
const AttendTest={
    type:TestReportType,
    args:{studentId:{type:GraphQLString},testId:{type:GraphQLString}},
    async resolve(parent,args){
        const create=new testReportModel({testId:args.testId,studentId:args.studentId});
        return await create.save();
    }
}
const ReviewTest={ 
    type:ReplyMessage,
    args:{reportId:{type:GraphQLString},marks:{type:GraphQLInt}},
    async resolve(parent,args){
        const create=await testReportModel.updateOne({_id:args.reportId},{$set:{marks:args.marks,isChecked:true}});
        return {message:"Test Reviewed"};
    }
}
const CreateSession={
    type:SessionType,
    args:{courseId:{type:GraphQLString},link:{type:GraphQLString},date:{type:GraphQLString},startTime:{type:GraphQLString}},
    async resolve(parent,args){
        const create=new sessionModel({courseId:args.courseId,link:args.link,date:args.date,startTime:args.startTime});
        return await create.save();
    }
}
module.exports ={TeacherType,TestType,TestReportType,CreateTest,AttendTest,ReviewTest,CreateSession,SessionType}
