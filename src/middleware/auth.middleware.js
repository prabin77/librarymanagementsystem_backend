const dotenv = require("dotenv")
dotenv.config()

const jwt = require("jsonwebtoken")
const {authSvc}= require("../modules/auth")
const patSvc = require("../modules/auth/personal.access.token.service")

const auth = async(req, res, next)=>{
    try{
        let token = req.headers['authorization']?? null;
        if(!token){
            next({status:401, msg:"please login first"})
        }else{
            
            token= (token.split(" ")).pop()
            let patData = await patSvc.getPATFromtoken(token)
            if(patData){
            let data =jwt.verify(token,process.env.JWT_SECRET)

            let user = await authSvc.getUserById(data.id);
            if(!user){
                next({status:404,msg:"User does not exists"})
            }else{
                req.authUser = user;
                next()
            }
        }else{
           next({status:401,msg:"User not loggedin"})
        }

        }

    }catch(exception){
        console.log(exception)
        let msg = exception.msg?? "invalid token";
        if(exception instanceof jwt.JsonWebTokenError){
            msg= exception.message
        }
        if(exception instanceof jwt.TokenExpiredError){
            msg= exception.message
        }
        next({status: 401 , msg:msg??"Invalid Token"})
    }

}
module.exports= auth;