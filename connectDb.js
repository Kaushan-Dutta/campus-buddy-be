const mongoose=require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_BASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Mongodb Connected");
}).catch((err)=>{
    console.log(err);
})
