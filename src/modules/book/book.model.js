const mongoose= require ('mongoose');


const BookSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
        unique: true,
    },
    slug:{
        type: String,
        require: true,
        unique: true,
    },
    quantity:{
        type: Number,
        require: true,
        min:0
    },
    author:{
        type:mongoose.Types.ObjectId,
        ref:"Author"
    },
    genres:[{
        type: mongoose.Types.ObjectId,
        ref:"Genre",
        require: true
    }],
    images:[{
        type:String
    }]
    ,
    publishedDate:{
        type:String,
        require:true

    },
    description:{
        type:String,
        require:true
    },
    publicationDetail:{
        type:String,
        require:true
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"inactive"

    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true,
    autoCreate:true,
    autoIndex:true,
})

const BookModel = mongoose.model("Book", BookSchema)
module.exports= BookModel