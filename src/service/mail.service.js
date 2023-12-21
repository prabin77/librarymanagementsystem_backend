const dotenv = require('dotenv')
dotenv.config();
const nodemailer = require("nodemailer")

class MailService{
    connection;
    message; 

    constructor(){
        try{
            this.connection = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PWD
                }
            });
        } catch(exception){
            throw {status: 500, msg: "Error connecting SMTP Server"}
        }
    }


    setMessage = ({to, cc ="", bcc="", sub, msgBody, attachement=""}) => {
        this.message = {
                to: to,
                from: "noreply@domain.com",
                subject:sub,
                html: msgBody,
        }
        if(cc){
            this.message.cc = cc;
        }
        if(bcc){
            this.message.bcc = bcc;
        }
        if(attachement){
            this.message.attachements = attachement;
        }
    }

    mailSend = async () => {
        try {
            let response = await this.connection.sendMail(this.message)
            return response
        } catch(exception){
            console.log(exception);
            throw {status: 500, msg: exception}
        }
    }
}

const mailSvc = new MailService()

module.exports = MailService;