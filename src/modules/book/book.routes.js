const auth = require("../../middleware/auth.middleware");
const {bookCtrl} = require("./")
const router = require("express").Router();
const uploader = require("../../middleware/uploader.middleware");
const { checkPermission } = require("../../middleware/rbac.middleware");


const uploadDir = (req, res, next) => {
req.uploadDir = "./public/uploads/books"
next()
}

router.get("/search",bookCtrl.getSearchResult)
router.get("/:slug/slug",bookCtrl.getBookBySlug)
router.get("/:genre/genre",bookCtrl.getBookByGenre)

router.route("/")
        .post(auth,uploadDir,uploader.array('images'),bookCtrl.createBook)
        .get(auth,bookCtrl.listBook)
        
router.route("/:id")
.get(auth,checkPermission("admin"),bookCtrl.getById)
        .put(auth,uploadDir,uploader.array('images'),bookCtrl.updateBook)
        .delete(auth,checkPermission('admin'),bookCtrl.deleteBook)
module.exports= router; 

