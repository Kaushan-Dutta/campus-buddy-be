const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLID,
} = require("graphql");

const ReplyMessage=new GraphQLObjectType({
    name:'ReplyMessage',
    fields:{
        _id:{type:GraphQLString},
        email:{type:GraphQLString},
        phone:{type:GraphQLString},
        message:{type:GraphQLString},
    }
})
module.exports={ReplyMessage}