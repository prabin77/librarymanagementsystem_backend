const  mongoose = require("mongoose")

const UserSchema =new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type:String,
        require:true,
        unique: true
    },
    password:String,
    address: {
        type:String,
    require:true
    },
    role:{
        type: String,
        enum:["student","teacher","admin"],
        default: "student"
    },
    image:String,
    phone: String,
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        default:null

    },
    status:{
        type:String,
        enum:["active","inactive"]
    },
    activationToken:{
        type:String,
        default:null 
    },
    passwordResetToken:{
        type:String,
        default:null
    }
},{
    timestamps:true,
    autoCreate:true,
    autoIndex:true
})

const UserModel= mongoose.model("User",UserSchema)

module.exports= UserModel;