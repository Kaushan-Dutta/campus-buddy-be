const nodemailer=require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();

let config={
    service:'gmail',
    auth:{
        user:process.env.MAILER_USER,
        pass:process.env.MAILER_PASWORD
    }
}
const transporter = nodemailer.createTransport(config);

var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Campus Buddy',
        link: 'https://campus-buddy-seven.vercel.app/'
        
    }
});

const signup_email=(id,password)=>{
    var email = {
        body: {
            name: 'User',
            intro: `Welcome to Campus Buddy, we\'re very excited to have you on board. Your id is ${id} and your password is ${password}.`,
            action: {
                instructions: 'To get started with Campus Buddy, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    return email
}

module.exports ={transporter,mailGenerator,signup_email};