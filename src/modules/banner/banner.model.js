const mongoose= require ('mongoose');


const BannerSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        unique: true,
    },
    
    image:{
        type:String
    },
    link:{
        type:String
    }

    ,
    
    status:{
        type:String,
        enum:["active","inactive"],
        default:"inactive"

    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:"user"
    }

},{
    timestamps:true,
    autoCreate:true,
    autoIndex:true,
})

const BannerModel = mongoose.model("Banner", BannerSchema)
module.exports= BannerModel