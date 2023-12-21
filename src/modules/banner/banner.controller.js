const BannerStoreTransformer = require("./banner.transformer")
class BannerController {
    _svc;
    constructor(bannerSvc){
        this._svc=bannerSvc
    }
    createBanner= async(req, res, next)=>{
        try{
            let data= new BannerStoreTransformer(req).transformData();
           
        let validbanner= await this._svc.validateBanner(data)
         data.createdBy = req.authUser._id;
         let response = await this._svc.storeBanner(validbanner);
         if(response){
            res.json({
                data: response,
                msg:"Banner created successfully",
                status:true,
                meta:null
            })
         }
        }catch(exception){
            //console.log(exception)
            next(exception)
        }

    }


    listBanner = async(req, res, next)=>{
        
        try{
            let pagination={
                perpage: parseInt(req.query.perPage) ?? 20,
                page:parseInt(req.query.page )?? 1

            }
            let data = await this._svc.getBannerList(pagination)
        if (data){
            res.json({
                data: data,
                msg:"Banner Listed Successfully",
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

    updateBanner = async( req, res, next)=> {
        try{
        let banner= await this._svc.getBannerById(req.params.id)
            console.log(req)
            let data = req.body;
            
            
            if(req.file){
                data['image'] = req.file.filename;
            }else{
                data.image =banner.image;
            }
            let validatedBanner = await this._svc.validateBanner(data)
            
            let response = await this._svc.bannerUpdate(req.params.id, validatedBanner)

            if(response){
                res.json({
                    data:response,
                    msg:"Banner updated successfully",
                    status: true,
                    meta: null  
                })
            }
        }catch(exception){
             console.log(exception)
            next({status:400, msg: exception.message?? "Error uploading data"})
        }
    }

    deleteBanner = async (req, res , next)=> {
        try{
            let response= await this._svc.bannerDelete(req.params.id)
            if(response){
                res.json({
                data: response,
                msg:"Banner deleted successfully",
                status:true,
                meta: null
            })
            }


        }catch(exception){
            next(exception)
        }
    }
   getBannerById = async (req, res , next)=> {
        try{
            let response= await this._svc.getBannerById(req.params.id)
            if(response){
                res.json({
                data: response,
                msg:"Banner feteched successfully",
                status:true,
                meta: null
            })
            }


        }catch(exception){
            next(exception)
        }
    }

}

module.exports = BannerController;