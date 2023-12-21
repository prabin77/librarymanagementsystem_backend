const {z}= require("zod")
const BannerModel = require("./banner.model")
class BannerService{

    validateBanner = async(data)=>{
        try{
 console.log(data)

            const validationSchema=z.object({
                name:z.string().min(3,{message:'Name must be of 3 character or greater'}).max(50).nonempty(),
                image: z.string().nonempty(),
                status:z.string().nonempty(),
                link:z.string().url()
                
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

    storeBanner = async( validbanner)=>{
        try{
            let banner = new BannerModel(validbanner)
            return banner.save();
        }catch(exception){
            throw exception;
        }
    }

    getCount = async(filter={})=>{
        try{
            return await BannerModel.count(filter);
        }catch(exception){
            throw exception
        }
    }


    getBannerList = async ( {perpage=20, page =1}) =>{
        try{
            let skip = (page-1)* perpage
            let list = await BannerModel.find()
                                        .sort({_id:"desc"})
                                        .limit(perpage)
                                        .skip(skip)
            return list;

        }catch(exception){
            throw exception
        }
    }

    getBannerById = async(id)=>{
        try{
            
            let data= await BannerModel.findById(id);
            if(!data){
                throw {status:404, msg: "Banner does not exists"}
            }
            console.log(data)

            return data;
        }catch(exception){
            throw exception
        }
    }

    bannerUpdate= async(id, data) =>{
        try{
            return await BannerModel.findByIdAndUpdate(id,{$set:data})
        }catch(exception){
            throw exception
        }
    }

    bannerDelete = async(id)=> {
        
        try{
            let response= await BannerModel.findByIdAndDelete(id)
            console.log(response)
            if(!response){
                throw{status: 404, msg:"Banner already deleted or not found"}
            }
            return response;
        }catch(exception){
            
            throw{status: 400, msg: exception.message ?? "Error deleting banner"}
        }
    }
}
module.exports= BannerService