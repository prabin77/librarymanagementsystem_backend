

class UserController{
    _svc
    Svc

    constructor({userSvc, userService}){
        this._svc= userSvc
        this.Svc= userService
    }

    listUser= async(req, res, next) =>{
        try{
            let response = await this._svc.allUser()
            res.json({
                data : response,
                msg: "User listed successfully",
                status: true,
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }

    updateUser = async ( req, res, next) =>{
        try{
            let user = await this.Svc.getUserById(req.params.id)
            console.log(req.body)
            let data = req.body;
            if(req.file){
                data['image']= req.file.filename;
            }else{data.image= user.image
            }
            let validateUser = await this.Svc.validateRegisterData(data)
            let response = await this._svc.userUpdate(req.params.id, validateUser)
            if(response){
                res.json({
                    data: response,
                    msg:"user updated successfully",
                    status:true,
                    meta: null
                })
            }

        }catch(exception){
            next(exception)
        }
    }

    deleteUser = async ( req, res, next) => {
        try{ 
            let id = req.params.id
            let response = await this._svc.userDelete(id)
            if(response){
                res.json({
                    data: response,
                    msg:"User deleted successfully",
                    status:true,
                    meta:null
                })
            }
        }catch(exception){
            next( exception)
        }
    }

    getUserById=async(req, res, next)=>{
        try{
            let data = await this._svc.getUserById(req.params.id)
            res.json({
                data:data,
                msg:"User fetched",
                status:true,
                meta:null
            })
        }catch(exception){
            next({
                status:400, msg:exception.message??"product does not exists"
            })
        }
    }   
}
module.exports= UserController