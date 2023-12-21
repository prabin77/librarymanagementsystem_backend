const auth = require("../../middleware/auth.middleware");
const {bannerCtrl} = require("./")
const router = require("express").Router();
const uploader = require("../../middleware/uploader.middleware");
const { checkPermission } = require("../../middleware/rbac.middleware");


const uploadDir = (req, res, next) => {
req.uploadDir = "./public/uploads/banners"
next()
}

router.route("/")
        .post(auth,uploadDir,uploader.array('image'),bannerCtrl.createBanner)
        .get(auth,bannerCtrl.listBanner)
        
router.route("/:id")
        .put(auth,uploadDir,uploader.array('images'),bannerCtrl.updateBanner)
        .delete(auth,bannerCtrl.deleteBanner)
        .get(auth,checkPermission("admin"),bannerCtrl.getBannerById)
module.exports= router;