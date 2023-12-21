const { default: mongoose } = require("mongoose");


const PersonalAccessTokenSchema = new mongoose.Schema({
    usedId:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        require:true
    },
    accessToken:{
        type: String,
        require: true
    },
    refreshToken:{
        type:String,
        require:true
    }
},{
    timestamps: true,
    autoIndex:true
})

const PersonalAccessTokenModel = mongoose.model("PersonalAccesssToken",PersonalAccessTokenSchema);

module.exports= PersonalAccessTokenModel;