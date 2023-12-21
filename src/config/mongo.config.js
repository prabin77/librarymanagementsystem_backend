const mongoose = require("mongoose");

const mongodbInit = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: process.env.MONGODB_DB
        })
        console.log("Db connection established")
    } catch(exception) {
        console.log(exception);
        throw {status: 500, msg: "Error establishing db Connection"}
    }
}

module.exports = mongodbInit;