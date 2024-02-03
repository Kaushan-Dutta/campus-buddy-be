const express=require('express');
const http=require('http');
const cors=require('cors');
const { graphqlHTTP } = require("express-graphql");

const app=express();
const server=http.createServer(app);
require("dotenv").config();

app.use(express.static('public'));
app.use(cors(
    {
        credentials:true
    }
));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/graphql", graphqlHTTP({
    schema:require('./Schema/schema.js'),
    graphiql: true 
}));
app.get('/',(req,res)=>{
    res.status(200).json({message:'Welcome to campus-buddy'});
})
const port=process.env.PORT || 8080;

server.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});