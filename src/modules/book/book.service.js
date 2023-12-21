const {z}= require("zod")
const BookModel = require("./book.model")
const { default: slugify } = require("slugify")
class BookService{
    _slug;
    _slugData;
    _genreData;
    validateBook = async(data)=>{
        
        try{
            const validationSchema=z.object({
                title:z.string().min(3,{message:'Title must be of 3 character or greater'}).max(50).nonempty(),
                quantity: z.number(),
                images: z.array(z.string()).nullable(),
                author:z.string().nullable(),
                genres:z.array(z.string()).nonempty(),
                status:z.string().nonempty(),
                publishedDate:z.string().nonempty(),
                publicationDetail:z.string().nonempty()
            })
            let response= validationSchema.parse(data)
            return response;
        }catch(exception){
            console.log(exception)
            let errorbags= {};
            exception.errors.map((item)=>{
                errorbags[item.path[0]]=item.message

            }
            )
            throw{status:400,msg:errorbags}
        }
    }

    storeBook = async( validbook)=>{
        try{

            let book = new BookModel(validbook) 
            return book.save();
        }catch(exception){
            throw exception;
        }
    }

    getCount = async(filter={})=>{
        try{
            return await BookModel.count(filter);
        }catch(exception){
            throw exception
        }
    }


    getBookList = async ( {perpage=20, page =1}) =>{
        try{
            let skip = (page-1)* perpage
            let list = await BookModel.find()
                                        .populate("genres")
                                        .populate("author") 
                                        .sort({_id:"desc"})
                                        .limit(perpage)
                                        .skip(skip)
            return list;

        }catch(exception){
            throw exception
        }
    }

    getBookById = async(id)=>{
        try{
            
            let data= await BookModel.findById(id);
            if(!data){
                throw {status:404, msg: "Book does not exists"}
            }
            console.log(data)

            return data;
        }catch(exception){
            throw exception
        }
    }
    getBookByFilter = async (filter={}) => {
        try {
            let data= await BookModel.find(filter)
                        .populate("genres")
                        .populate("author")
                        .sort({_id: "desc"})
                        .limit(10)

                        return data
        } catch(exception){
            throw exception
        }
    }

    getUniqueSlug = async(slug) => {
       
        let book = await this.getBookByFilter({slug: slug})
        if(book.length){
            slug += "-"+Date.now();
            await this.getUniqueSlug(slug);
        } else { 
            this._slug=slug;
        }
    }
                                
    
    getBookBySlug = async(slug)=>{
        try{
             
            let data= await BookModel.findOne({
                slug:slug
            })//slug sanga match va xaina
            if(data){
                this._slugData=data
                
            }else{
                throw {status:404, msg: "Book does not exists"}

            }

           
        }catch(exception){
            console.log(exception)
            throw exception
        }
    } 

    getBookByGenre = async(genre)=>{
        try{
             
            let data= await BookModel.findOne({
                genre:genre
            })
            if(data){
                this._genreData=data
                
            }else{
                throw {status:404, msg: "Book does not exists"}

            }

           
        }catch(exception){
            console.log(exception)
            throw exception
        }
    } 

    bookUpdate= async(id, data) =>{
        try{
            return await BookModel.findByIdAndUpdate(id,{$set:data})
        }catch(exception){
            throw exception
        }
    }

    bookDelete = async(id)=> {
        
        try{
            let response= await BookModel.findByIdAndDelete(id)
            
            if(!response){
                throw{status: 404, msg:"Book already deleted or not found"}
            }
            return response;
        }catch(exception){
            
            throw{status: 400, msg: exception.message ?? "Error deleting book"}
        }
    }
}
module.exports= BookService