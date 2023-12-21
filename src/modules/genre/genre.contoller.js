const slugify= require("slugify")

class GenreController{
    _svc
    constructor(genreSvc){
        this._svc=genreSvc
    }
    
    createGenre= async(req, res, next)=>{
        try{
            let data= req.body;
            if(req.file){
                data['image']= req.file.filename
            }else{
                data.image = genre.image
            }
            let validgenre = await this._svc.validateGenre(data)
            data.createdBy= req.authUser._id
            let slug= slugify(data.name,{lower:true})
           await this._svc.getUniqueSlug(slug);
            validgenre.slug= await this._svc._slug
            let response = await this._svc.storeGenre(validgenre)
            if(response){
                res.json({
                    data: response,
                    msg: "Genre created successfully",
                    status:true,
                    meta:null
                })
            }
        }catch(exception){
            next(exception)
        }
    }

    listGenre= async (req, res, next)=>{
        try{
            let pagination = {
                perPage: parseInt(req.query.perPage) ?? 10,
                page: parseInt(req.query.page) ?? 1

            }
            let data = await this._svc.genreList( pagination)
            if(data){
                res.json({
                    data:data,
                    msg:"Genre listed successfully",
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

    updateGenre = async(req, res, next)=> {
        try{
            let genre = await this._svc.getGenreById(req.params.id)
            let data = req.body
            if(req.file){
                data['image']= req.file.filename
            }else{
                data.image = genre.image
            }
            let validdata = await this._svc.validateGenre(data)

            let response= await this._svc.genreUpdate(req.params.id,validdata)
            if(response){
                res.json({
                    data:response,
                    status: true,
                    msg:"Genre updated successfully",
                    meta: null

                })
            }

        }catch(exception){
            next (exception)
        }
    }

    deleteGenre = async ( req, res, next) => {
        try{
            
            let response = await this._svc.genreDelete(req.params.id)

        }catch(exception){
            next (exception)
        }
    }
    getGenreById = async (req, res , next)=> {
        try{
            let response= await this._svc.getGenreById(req.params.id)
            if(response){
                res.json({
                data: response,
                msg:"Genre feteched successfully",
                status:true,
                meta: null
            })
            }


        }catch(exception){
            next(exception)
        }
    }
}
module.exports= GenreController;