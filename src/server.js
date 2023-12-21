const http = require('http')
const app = require("./config/app");

const server = http.createServer(app)

server.listen(3005, "localhost",(err)=>{
    if(!err){
        console.log("Server is listing to port 3005")
        console.log("press CTRL+C to disconnect server")
    }
})