const router= require("express").Router()
const auth= require("../../middleware/auth.middleware")
const {genreCtrl}= require ("./index")
const uploader = require("../../middleware/uploader.middleware")

const uploadDir = (req, res, next) => {
        req.uploadDir = "./public/uploads/genre"
        next()
        }
        
        router.get("/:slug/slug",genreCtrl.getGenreBySlug)
router.route("/")
        .get(auth,genreCtrl.listGenre)
        .post(auth,uploadDir,uploader.single("image"),genreCtrl.createGenre)

router.route("/:id")
        .put(auth,uploadDir,uploader.single("image"),genreCtrl.updateGenre)
        .delete(auth,genreCtrl.deleteGenre)
        .get(auth,genreCtrl.getGenreById)
module.exports= router;