const mongoose= require("mongoose")

const AuthorSchema= new mongoose.Schema({

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


const AuthorModel = mongoose.model("Author",AuthorSchema)

module.exports= AuthorModel