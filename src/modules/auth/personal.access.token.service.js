const PersonalAccessTokenModel = require("./personal.accesstoken.model");
const PersonalAccessModel = require("./personal.accesstoken.model")
const personalAccessToken= require("./personal.accesstoken.model")

class PersonalAccesssTokenService{
    storeinDB = async(data)=> {
        try{
            let pat = new PersonalAccessTokenModel(data)

            return pat.save();

        }catch(exception){
            console.log(exception)
            throw {status: 400, msg:"Cannot store personal access token"}
        }
    }

    updateAccessToken = async(data,id)=>{
        try{
            let update = await PersonalAccessTokenModel.findByIdAndUpdate(
                id,
                {$set:data},
                { new: true }
            )
            return update;
        }catch(exception){
            throw{status:400, msg:"Error updating access token"}
        }
    }

    getPATFromtoken = async(token)=>{
        try{
            
            let data = await PersonalAccessTokenModel.findOne({
                $or: [
                    {refreshToken:token},
                    {accessToken:token}
                ]
            })
            
            if(data){
                return data;
            }else{
                throw{status:400,msg:"Token query error"}
            }
        }catch(exception){
            throw exception
        }
    }
    deletePAT = async(token) => {
        try {
          let res = await PersonalAccessTokenModel.deleteOne({
            accessToken: token
          })
          console.log(res)
          return res;
        } catch(exception) {
          console.log(exception)
          throw exception;
        }
      }

}
const patSvc = new PersonalAccesssTokenService()
module.exports= patSvc;