const multer = require("multer")
const fs = require("fs");

const myStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        let path = req.uploadDir || "./public"
        if(!fs.existsSync(path)){
            fs.mkdirSync(path, {recursive: true})
        }
        cb(false, path)
    },
    filename: (req, file, cb) => {
        // generate some random strings 
        // filename.ext
        let name = Date.now()+"-"+file.originalname
        cb(false, name);
    }
});
const imageFilter = (req, file, cb )=>{
    //
    // console.log(file)
    let ext = ((file.originalname).split(".")).pop()
    // JPG
    let allow = ['jpg','jpeg','png','webp','bmp','gif','svg']
    if(allow.includes(ext.toLowerCase())){
        cb(false, true)
    } else {
        cb({status: 400, msg: "File format not supported."})
    }
}
const uploader = multer({
    storage: myStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5000000
    }
})

module.exports= uploader;