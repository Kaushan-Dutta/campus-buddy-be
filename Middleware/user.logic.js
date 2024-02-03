const jwt=require('jsonwebtoken');

const GenerateUserId = () => {
  return Math.floor(Math.random() * 10000000000) + 1
};
const GenerateCollegeId = () => {
  return Math.floor(Math.random() * 1000) + 1
};
const GenerateToken=(user)=>{
  return jwt.sign(user,process.env.TOKEN_SECRET,{expiresIn:'1d'})
}
const MatchToken=(token)=>{
  return jwt.verify(token,process.env.TOKEN_SECRET)
}
module.exports= {GenerateUserId,GenerateCollegeId, GenerateToken, MatchToken};