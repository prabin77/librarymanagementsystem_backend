const {z} = require ("zod")
const GenreModel = require("./genre.model")

class GenreServices{
    _slug;
    _slugData

    validateGenre=async(data)=>{
       
       try{
        const validationSchema = z.object({
            name:z.string().min(3,{message:"Name must be of 3 character or greater"}).max(50).nonempty(),
            description: z.string(),
            image:z.string(),
            status: z.string()
            

        })
        let response= validationSchema.parse(data)
        return response
       }catch(exception){
        
        let errorbags={}
        exception.errors.map((item)=>{
            errorbags[item.path[0]]=item.message
        })
        throw {status: 400, msg: errorbags}

       }
    }

    storeGenre= (data)=> {
        try{
            let genre= new GenreModel(data)
            return genre.save()

        }catch(exception){
            throw{status:400, msg:"Error storing genre"}
        }
    }

    genreList =async ({perPage=10,page=1})=>{
        try{
            let skip= (page-1)*perPage
            let list= await GenreModel.find()
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
          return  await GenreModel.count(filter)

        }catch(exception){
            throw exception;
        }
    }

    getGenreById= async(id) =>{
        try{
            let data= await GenreModel.findById(id)
            if(!data){
                throw{
                    status:400,
                    msg:"Genre not found"
                }
            }
            return data;
        }catch(exception){
            throw exception
        }
    }

    genreUpdate= async (id, data)=> {
        try{
            let response = await GenreModel.findByIdAndUpdate(id,{$set:data})
            if(!response){
                throw{status: 404, msg: "Error updating data"}
            }
            return response

        }catch(exception){
            throw{status:400 , msg: "Error Updating data"}
        }
    }

    genreDelete = async (id) => {
        try{
            let response = await GenreModel.findByIdAndDelete(id)
            if(!response){
                throw{status:404, msg:"Error deleting genre or already deleted"}
            }
            return response
        }catch(exception){
            throw{status:400, msg:exception.message ?? "Error deleting genre"}
        }
    }

    getGenreByFilter = async (filter={}) => {
        try {
            let data= await GenreModel.find(filter)
                        .sort({_id: "desc"})
                        .limit(10)

                        return data
        } catch(exception){
            throw exception
        }
    }

    getUniqueSlug = async(slug) => {
       
        let genre = await this.getGenreByFilter({slug: slug})
        if(genre.length){
            slug += "-"+Date.now();
            await this.getUniqueSlug(slug);
        } else { 
            this._slug=slug;
        }
    }
                                
    
    getGenreBySlug = async(slug)=>{
        try{
             
            let data= await GenreModel.findOne({
                slug:slug
            })
           return data

           
        }catch(exception){
            console.log(exception)
            throw exception
        }
    } 
}
module.exports= GenreServices;