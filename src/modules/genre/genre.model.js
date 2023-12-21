const mongoose= require("mongoose")

const GenreSchema= new mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    slug:{
        type: String,
        require: true,
        unique: true,
    },
    description:{
        type: String,
        
    },

    image:{
        type:String
    },
    
    status:{
        type:String,
        enum:["active", "inactive"],
        default:"inactive"

    }



},{
    timestamps:true,
    autoIndex:true,
    autoCreate: true
}
)


const GenreModel = mongoose.model("Genre",GenreSchema)

module.exports= GenreModel