const { MongoClient } = require("mongodb");

class MongoDBService{
    _connection;
    db;

    constructor() {
        this.connect();
    }

    connect = async () => {
        // db Connection
        try {
            this._connection = await MongoClient.connect(process.env.MONGODB_URL)
            this.db = this._connection.db(process.env.MONGODB_DB)
        } catch(err) {
            console.log(err);
            throw {status:500, msg: "Error establishing db connection..."}
        }
    }
}

module.exports = MongoDBService;