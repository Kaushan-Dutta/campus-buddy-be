const {userModel}=require('../Model/UserModel');
const {collegeModel}=require('../Model/AdminModel')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
} = require("graphql");
const {CollegeType}=require('./college.schema');
const {ReplyMessage}=require('./input.schema.js');

const MaintainerType=new GraphQLObjectType({
    name: "Maintainer",
    fields:()=>({
        _id: { type: GraphQLString },
        maintainer:{
            type:UserType,
            resolve(parent,args){
                return userModel.findById(parent.userId)
            }
        },
        collegeList:{
            type:CollegeType,
            resolve(parent,args){
                return collegeModel.find({});
            }
        }
    }),

})
const ApproveCollege={
    type:ReplyMessage,
    args:{
        collegeId:{type:GraphQLString},
        status:{type:GraphQLString}
    },
    async resolve(parent,args){
        console.log(args.collegeId,args.status)
        try{
            if(args.status === 'rejected'){
                const reject=await collegeModel.deleteOne({_id:args.collegeId});
                return {message:"Rejected Mail"}
            }
            else{
                try {
                    const approve = await collegeModel.findByIdAndUpdate(
                        args.collegeId,
                        { $set: { status: 'accepted' } },
                        { new: true }
                    );
                    console.log(approve);
                    console.log(approve._id, approve.email);
                    return { message: "Approved Mail", _id: approve._id, email: approve.email, phone: approve.phone };
                } catch (error) {
                    console.error('Error approving college:', error);
                    throw error;
                }
                
            }
        }
        catch(err){
            return new Error(err.message);
        }
    }
}

module.exports={ApproveCollege}
