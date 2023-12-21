const {authCtrl}= require(".");
const uploader = require("../../middleware/uploader.middleware");
const auth = require("../../middleware/auth.middleware")
const router = require("express").Router()


const uploadPath = ( req,res ,next)=>{
        let path = "./public/user"
        req.uploadDir = path;
        next()
}

router.post("/register",uploadPath,uploader.single("image"),authCtrl.createUser)
router.get("/verify-token/:token",authCtrl.verifyToken)
router.post("/password-set/:token",authCtrl.setPassword)

router.post("/login",authCtrl.login)
router.get ("/refresh-token",auth,authCtrl.refreshToken)
router.get("/me",auth,authCtrl.getLoggedInUserProfile)

router.post('/logout', auth, authCtrl.logout)
module.exports= router;