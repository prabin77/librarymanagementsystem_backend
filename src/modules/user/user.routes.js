const router = require('express').Router()
const auth= require("../../middleware/auth.middleware")
const userCtrl = require("./index")

router.route("/")
        .get(auth,userCtrl.listUser)

router.route("/:id")
        .put(auth,userCtrl.updateUser)
        .delete(auth,userCtrl.deleteUser)
        .get(auth,userCtrl.getUserById)
module.exports=router