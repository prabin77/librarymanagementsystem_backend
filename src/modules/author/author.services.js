const {z} = require ("zod")
const AuthorModel = require("./author.model")

class AuthorServices{
_slug;
    validateAuthor=async(data)=>{
        console.log(data)
       
       try{
        const validationSchema = z.object({
            name:z.string(),
            description: z.string(),
            status: z.string()
        })
        let response= validationSchema.parse(data)
        return response
       }catch(exception){
        let errorbag={}
        exception.error.map((item)=>{
            errorbag[item.path[0]]=item.message
        })
        throw {status: 400, msg: errorbag}

       }
    }

    storeAuthor= (data)=> {
        try{
            let author= new AuthorModel(data)
            return author.save()

        }catch(exception){
            throw{status:400, msg:"Error storing author"}
        }
    }

    authorList =async ({perPage=10,page=1})=>{
        try{
            let skip= (page-1)*perPage
            let list= await AuthorModel.find()
                                        .skip(skip)
                                        .limit(perPage)
                                        .sort({_id:"desc"})

            return list;

        }catch(exception){
            throw{status:400, msg:exception.message?? "Error fetching data"}
        }
    }

    getCount= async(filter={})=>{
        try{
          return  await AuthorModel.count(filter)

        }catch(exception){
            throw exception;
        }
    }

    getAuthorById= async(id) =>{
        try{
            let data= await AuthorModel.findById(id)
            if(!data){
                throw{
                    status:400,
                    msg:"Author not found"
                }
            }
            return data;
        }catch(exception){
            throw exception
        }
    }

    authorUpdate= async (id, data)=> {
        try{
            let response = await AuthorModel.findByIdAndUpdate(id,{$set:data})
            if(!response){
                throw{status: 404, msg: "Error updating data"}
            }
            return response

        }catch(exception){
            throw{status:400 , msg: "Error Updating data"}
        }
    }

    authorDelete = async (id) => {
        try{
            let response = await AuthorModel.findByIdAndDelete(id)
            if(!response){
                throw{status:404, msg:"Error deleting author or already deleted"}
            }
            return response
        }catch(exception){
            throw{status:400, msg:exception.message ?? "Error deleting Author"}
        }
    }

    
    getAuthorByFilter = async (filter={}) => {
        try {
            let data= await AuthorModel.find(filter)
                        .sort({_id: "desc"})
                        .limit(10)

                        return data
        } catch(exception){
            throw exception
        }
    }

    getUniqueSlug = async(slug) => {
       
        let author = await this.getAuthorByFilter({slug: slug})
        if(author.length){
            slug += "-"+Date.now();
            await this.getUniqueSlug(slug);
        } else { 
            console.log(slug)
            this._slug=slug;
        }
    }
                                
    
    // getAuthorBySlug = async(slug)=>{
    //     try{
             
    //         let data= await AuthorModel.findOne({
    //             slug:slug
    //         })
    //         if(data){
    //             this._slugData=data
                
    //         }else{
    //             throw {status:404, msg: "Book does not exists"}

    //         }

           
    //     }catch(exception){
    //         console.log(exception)
    //         throw exception
    //     }
    // } 

}
module.exports= AuthorServices;