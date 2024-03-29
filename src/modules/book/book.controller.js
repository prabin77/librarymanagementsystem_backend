const BookModel = require("./book.model");
const BookStoreTransformer = require("./book.transformer")
const slugify = require("slugify");
class BookController {
    _svc;
    constructor(bookSvc){
        this._svc=bookSvc
    }
    createBook= async(req, res, next)=>{
        try{
            let data= new BookStoreTransformer(req).transformData();
         await this._svc.validateBook(data)
      
         data.createdBy = req.authUser._id;
         let slug= slugify(data.title,{lower:true})
         
           await this._svc.getUniqueSlug(slug);
            data.slug= await this._svc._slug

         let response = await this._svc.storeBook(data);
         
         if(response){
            res.json({
                data: response,
                msg:"Book created successfully",
                status:true,
                meta:null
            })
         }
        }catch(exception){
            //console.log(exception)
            next(exception)
        }

    }


    listBook = async(req, res, next)=>{
        
        try{
            let pagination={
                perpage: parseInt(req.query.perPage) ?? 12,
                page:parseInt(req.query.page )?? 1

            }
            let data = await this._svc.getBookList(pagination)
        if (data){
            console.log(data)
            res.json({
                data: data,
                msg:"Book Listed Successfully",
                meta : {
                    totalCount : await this._svc.getCount(),
                    ...pagination
                }
            })
        }

        }catch(exception){
            next({status:400, msg:exception.message ??"Error featching data"})
        }
        

    }

    updateBook = async( req, res, next)=> {
        try{
        let book= await this._svc.getBookById(req.params.id)

            let data = req.body;
             data.quantity= Number(data.quantity)
             data.genres = data.genres.split(",")
            
            if(req.file){
                data['images'] = req.file.filename;
            }else{
                data.images =book.images;
            }
            let validatedBook = await this._svc.validateBook(data)
            
            let response = await this._svc.bookUpdate(req.params.id, validatedBook)

            if(response){
                res.json({
                    data:response,
                    msg:"Book updated successfully",
                    status: true,
                    meta: null  
                })
            }
        }catch(exception){
             console.log(exception)
            next({status:400, msg: exception.message?? "Error uploading data"})
        }
    }
getById=async(req, res, next)=>{
    try{
        let data = await this._svc.getBookById(req.params.id)
        res.json({
            data:data,
            msg:"Book fetched",
            status:true,
            meta:null
        })
    }catch(exception){
        next({
            status:400, msg:exception.message??"product does not exists"
        })
    }
}   
    deleteBook = async (req, res , next)=> {
        try{
            let response= await this._svc.bookDelete(req.params.id)
            if(response){
                res.json({
                data: response,
                msg:"Book deleted successfully",
                status:true,
                meta: null
            })
            }


        }catch(exception){
            next(exception)
        }
    }

    getSearchResult= async( req, res, next)=>{
        try{
            let keyword =req.query.keyword

            let bookList= await this._svc.getBookBySearch(keyword)
            
            res.json({
                data:bookList,
                status:true,
                msg:"search successful"
            })
        }catch(exception){
            next (exception)
        }
    }

    getBookBySlug=async(req, res, next)=>{
        
        try{
            let slug = req.params.slug;
           
             this._svc.getBookBySlug(slug)
             let data = await this._svc._slugData
            console.log(data)
            if(data){
                res.json({
                data:data,
                status:true,
                msg:"Book detail fetched"    
            })
            }else{
                res.json({
                    data:null,
                    status:false,
                    msg:"Book does not  exists"
                })
            }
        }catch(exception){
            next( exception)
        }
    }
    getBookByGenre=async(req, res, next)=>{
        try{
            let id = req.params.id;
            console.log(id)
             let data= await this._svc.getBookByGenre(id)
                                    
            
           if(data){
                res.json({
                data:data,
                status:true,
                msg:"Book detail fetched"    
            })
            }else{
                res.json({
                    data:null,
                    status:false,
                    msg:"Book does not  exist"
                })
            }
        }catch(exception){
            
            next(exception)
        }
    }

}

module.exports = BookController;