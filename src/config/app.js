const express = require('express')
const router = require("../routes/index")
const cookieParser = require('cookie-parser')
const mongodbInit= require("./mongo.config")
const cors = require("cors")
const multer = require('multer')
mongodbInit()

const app = express()


app.use(cors({
    origin:"http://localhost:5173"
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/asset',express.static(process.cwd()+"/public/"))
app.use('/api/v1',router)


app.use((req,res,next)=>{
    next({status:404, msg:"Not found"})
})
app.use((error, req, res, next)=>{
    console.log(error)
    let status = error.status|| 500;
    let msg = error.msg || "Inetrnal server error"
    if(error instanceof multer.MulterError){
        if(error.code==="LIMIT_UNEXPECTED_FILE"){
            msg="Unexpected field" +error.field;
            status=400;
        }

        if(error.code==="LIMIT_FILE_SIZE"){
            msg="File size too large";
            status= 400;
        }

        
    }

    if (error.code === 11000) {
        let key = Object.keys(error.keyPattern);
        let value = error.keyValue[key[0]];
        
          if(key[0] === 'slug') {
          key = "name or title"
        } else {
          key = key[0]
        }
        
        msg = key+" with value "+value+ " already exists and should be unique." ;
        status = 400
      }

    res.status(status).json({
        data: null,
        msg: msg,
        meta: null
    })
})
module.exports= app;



