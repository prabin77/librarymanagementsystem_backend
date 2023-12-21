const dotenv= require("dotenv")
dotenv.config()

const { generateRandomString } = require("../../utilities/helpers");
const bcrypt= require("bcryptjs")
const jwt = require("jsonwebtoken")
const patSvc = require("./personal.access.token.service")


class AuthController {

    constructor(svc){
        this.authSvc= svc;
        this.patSvc = patSvc;
    }

    createUser = async(req, res, next) => {
        try{
            let data = req.body
            
            data.image= req.file.filename;

            let validData = await this.authSvc.validateRegisterData(data)
            let activationToken= generateRandomString(100)
            validData.activationToken= activationToken

            let response = await this.authSvc.registerUser(validData);
            await this.authSvc.sendActivationEmail(data.email,data.name,activationToken)
            res.json({
                result: response,
                msg:"Registered Successfully",
                meta: null,
            })
        }catch(exception){
            if(Number(exception.code) === 11000 ) {
                next({status: 400, msg: "Email should be unique"})
              }
              next(exception)
        }


    }

    verifyToken= async(req, res, next)=>{
        try{
            let token= req.params.token;
            let user = await this.authSvc.getUserByToken(token)
            
            if(!user){
                next({ status:400,msg:"Token broken or user already activated"})
            }else{
                res.json({
                    data: user,
                    status:true,
                    msg : "ready for activation",
                    meta: null
                })
            }
        }catch(exception){
            next(exception)
        }
    }

    setPassword= async(req, res, next) => {
        try{
            let user = await this.authSvc.getUserByToken(req.params.token)
            
            if(!user){
                throw{status: 404, msg:"User does not exists"}
            }
            let data = req.body
            if (!data.password || data.password !== data.confirmPassword || data.password.length < 8) {
                throw { status: 400, msg: "Password must be of atlease 8 characters and should match Re-password" }
            }
            let password = await bcrypt.hash(data.password,10)
            let updateBeforeUser = await this.authSvc.updateUser({
                password: password,
                activationToken:null,
                status:"active"
            },user._id)

            res.json({
                data:updateBeforeUser,
                status:true,
                msg: "Your account has been activated successfully",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }

    login= async(req, res, next) => {
        try{
            let credentials= req.body;
            if(!credentials.email || !credentials.password){
                throw{ status: 400, msg: "Credentials required."}
            }
            let user = await this.authSvc.getUserByFilter({
                email: credentials.email
            })
            if(!user){
                next({status: 422, msg: "User does not exists"})
            }
        else{
            if(user.length){
                user = user[0];
                if(bcrypt.compareSync(credentials.password,user.password)){
                    if(user.status === 'active'){
                        let {_id}= user;
                        let accessToken= jwt.sign({
                            id:_id
                        },process.env.JWT_SECRET,{
                            expiresIn: '1h'
                        })
                        let refreshToken= jwt.sign({
                            id:_id
                        },process.env.JWT_SECRET,{
                            expiresIn: '1d'
                        })
                        let pat ={
                            userId: _id,
                            accessToken:accessToken,
                            refreshToken:refreshToken
                        }
                        await this.patSvc.storeinDB(pat);
                        res.json({
                            data:{
                                accessToken:accessToken,
                                refreshToken:refreshToken,
                                userDetail:{
                                    id:user._id,
                                    name:user.name,
                                    role:user.role
                                }
                            },
                            status:true,
                            msg:"You are logged in",
                            meta : null

                        })
                    }else{
                        next({status: 422,msg: "User not activated or is suspended" })
                    }
                }else{
                    next({status:422, msg:"credentials does not match"})
                }
            }else{
                next({status: 400, msg:"User does not match"})
            }
        }
        }catch(exception){
            next(exception)
        }
    }


    refreshToken= async (req, res, next)=>{
        try{   let id = req.authUser.id;
            let accessToken= jwt.sign({
                id:id
            },process.env.JWT_SECRET,{expiresIn:"1h"})
            let refreshToken = (req.header['authorization'].split(" ")).pop();
            let pat = {
                userId: id,
                accessToken : accessToken,
                refreshToken: refreshToken
            }

            let patInfo = await this.patSvc.getPATFromtoken(refreshToken)
            let response = await this.patSvc.updateAccessToken(pat,patInfo._id)
            res.json({
                data: response.accessToken,
                status: true,
                msg:"Token refreshed",
                meta : null
            })
        }catch(exception){
            console.log(exception)
            next(exception)
        }
    
    }

    getLoggedInUserProfile= async (req , res, next) => {
        try{
            res.json({
                data: req.authUser,
                status: true,
                msg:"Your Profile",
                meta:null
            })
        }catch(exception){
            next(exception)
        }
    }
    logout = async (req, res, next) => {
        try {
          let token = req.headers['authorization'];
          token = token.split(" ")[1];
          let pat = await this.patSvc.deletePAT(token);
          res.json({
            status: true,
            data: pat,
            msg: "Successfully logged out"
          })
        } catch (exception) {
          console.log(exception)
          next(exception)
        }
      }
    
}

module.exports = AuthController;