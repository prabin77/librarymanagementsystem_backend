const UserModel = require("../auth/user.model")
class UserService{

    allUser =async ()=>{
     try {
         return await UserModel.find()
    }catch(exception){
        throw{status: 404 , msg:"error listing data"}
    }}

    userUpdate= async(id,data)=>{
        try{
            return   await UserModel.findByIdAndUpdate(id,{$set:data})
        }catch(exception){
            throw{status:404, msg:"Error updating data"}
        }
    }
    getUserById = async(id)=>{
        try{
            
            let data= await UserModel.findById(id);
            if(!data){
                throw {status:404, msg: "Book does not exists"}
            }
            
            return data;
        }catch(exception){
            throw exception
        }
    }

    userDelete = async (id) => {
        try{
            return await UserModel.findByIdAndDelete(id)
        }catch(exception){
            throw{status:404, msg:"Error deleting data"}
        }
    }
}
module.exports= UserService