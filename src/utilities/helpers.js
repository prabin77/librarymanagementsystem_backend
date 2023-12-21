const fs = require("fs");

const generateRandomString = (len = 100) => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let strlen = chars.length;  // string => an array of characters
    let random = "";
    for(let i = 0; i < len; i++){
        let posn = Math.ceil((Math.random())*(strlen-1))           // posn => 15
        random += chars[posn];              // cahrs[15] => "9e....."
    }
    return random;
}

const deleteFileFromServer = (filename, path) => {
    // /public/user/image.ext
    // path => /public/user
    // filename => image.ext
    if(fs.existsSync(path+"/"+filename)){
        fs.unlinkSync(path+"/"+filename)
    }
}

module.exports = {generateRandomString, deleteFileFromServer}