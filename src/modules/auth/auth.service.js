const {z}= require("zod")
const MailService= require("../../service/mail.service")
const UserModel = require("./user.model")

class AuthService{
    mailSvc

        validateRegisterData = async (data)=>{
            try{

                const validationSchema= z.object({
                name:z.string().min(6,{ message: "Name must be of atleast 6 characters"
                }).max(50).nonempty(),
                email:z.string().email().nonempty(),
                address: z.string().nonempty(),
                phone: z.string().nullable(),
                image: z.string().nullable(),
                role:z.string().nonempty()
                })
                let response= validationSchema.parse(data)
                return response;

            }catch(exception){
                let errorbags= {};
                exception.errors.map((item)=>{
                    errorbags[item.path[0]]=item.message

                }
                )
                throw{status:400,msg:errorbags}
            }
        }

        sendActivationEmail= async(to , name , token)=>{
            try{
                this.mailSvc= new MailService();
                let url= "http://localhost:5173/activate/"+token
                this.mailSvc.setMessage({
                    to: to,
                    sub: "Activate your account",
                    msgBody:`<p><strong>Dear ${name},</strong></p> Your account has been registerd. 
                    <p>Please click the link below or copy paste the url to activate your account: </p>
                    <a href="${url}">${url}</a>
                    <br/>
                    <p>Regards,</p>
                    <p>System Admin</p>
                    <p><small>Please do not reply to the same email</small></p>
                    `,
                })
                return await this.mailSvc.mailSend()
            }catch(err){
                throw err
            }
        }

        registerUser= async(data)=>{
           // console.log(data)
            try{
                let user = new UserModel(data);
                return await user.save()

            }catch(exception){
                console.log(exception)
                throw({status:500,msg:"Error processing query"})
            }
        }

        getUserByToken= async(activationToken)=>{
            try{
                let user= await UserModel.findOne({
                    $and: [
                        {activationToken:activationToken},
                        {activationToken:{$ne:null}}
                    ]
                })
                return user;
            }catch(exception){
                throw({status:500, msg:"error fetching data"})
            }
        }

        updateUser = async (data, id)=>{
            try{
                let prevUser = await UserModel.findByIdAndUpdate(id,{
                    $set :data
                })
                return prevUser
            }catch(exception){
                throw{status:422, msg: "Update Failed"}
            }
        }

        getUserByFilter= async (filter={})=>{
            try{
                return await UserModel.find(filter)
                
            }catch(exception){
                throw {status: 422, msg:"User fetch error"}
            }
        }

        getUserById= async(id) => {
            try{
                let user= await UserModel.findById(id,{password:0})
                if(!user){
                    throw {status: 404, msg:"user does not exists"}
                }else{
                    return user;
                }
            }catch(exception){
                throw exception
            }
        }
}

module.exports= AuthService;