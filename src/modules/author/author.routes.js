const router= require("express").Router()
const auth= require("../../middleware/auth.middleware")
const {authorCtrl}= require ("./index")
const uploader= require("../../middleware/uploader.middleware")
const { checkPermission } = require("../../middleware/rbac.middleware");

router.route("/")
        .get(auth,authorCtrl.listAuthor)
        .post(auth,authorCtrl.createAuthor)

router.route("/:id")
        .put(auth,authorCtrl.updateAuthor)
        .delete(auth,authorCtrl.deleteAuthor)
        .get(auth,checkPermission("admin"),authorCtrl.getAuthorById)
module.exports= router;