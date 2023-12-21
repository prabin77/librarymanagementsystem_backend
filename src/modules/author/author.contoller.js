const slugify = require("slugify");

class AuthorController{
    _svc
    constructor(authorSvc){
        this._svc=authorSvc
    }
    createAuthor= async(req, res, next)=>{
        try{
            let data= req.body;
            
            let validauthor = await this._svc.validateAuthor(data)
            data.createdBy= req.authUser._id
            let slug= slugify(data.name,{lower:true})
         
           await this._svc.getUniqueSlug(slug);
            validauthor.slug= await this._svc._slug

            let response = await this._svc.storeAuthor(validauthor)
            console.log(response)
            if(response){
                res.json({
                    data: response,
                    msg: "Author created successfully",
                    status:true,
                    meta:null
                })
            }
        }catch(exception){
            next(exception)
        }
    }

    listAuthor= async (req, res, next)=>{
        try{
            let pagination = {
                perPage: parseInt(req.query.perPage) ?? 10,
                page: parseInt(req.query.page) ?? 1

            }
            let data = await this._svc.authorList( pagination)
            if(data){
                res.json({
                    data:data,
                    msg:"Author listed successfully",
                    status:true,
                    meta:{
                        totalCount: await this._svc.getCount(),
                        ...pagination
                    }
                })
            }
        }catch(exception){
            next(exception)
        }

    }

    updateAuthor = async(req, res, next)=> {
        try{
            let author = await this._svc.getAuthorById(req.params.id)
            let data = req.body
            
            let validdata = await this._svc.validateAuthor(data)
            

            let response= await this._svc.authorUpdate(req.params.id,validdata)
            if(response){
                res.json({
                    data:response,
                    status: true,
                    msg:"Author updated successfully",
                    meta: null

                })
            }

        }catch(exception){
            next (exception)
        }
    }

    deleteAuthor = async ( req, res, next) => {
        try{
            
            let response = await this._svc.authorDelete(req.params.id)
            res.json({
                data: response,
                msg:"Author deleted successfully",
                status:true,
                meta: null
            })
        }catch(exception){
            next (exception)
        }
    }

    getAuthorById = async (req, res , next)=> {
        try{
            let response= await this._svc.getAuthorById(req.params.id)
            if(response){
                res.json({
                data: response,
                msg:"Author feteched successfully",
                status:true,
                meta: null
            })
            }


        }catch(exception){
            next(exception)
        }
    }
}
module.exports= AuthorController;