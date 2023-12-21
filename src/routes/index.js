 const router= require("express").Router();

 const authRoutes= require("../modules/auth/auth.routes")
const bookRoutes = require("../modules/book/book.routes")
const genreRoutes = require("../modules/genre/genre.routes")
const authorRoutes = require("../modules/author/author.routes")
const userRoutes = require("../modules/user/user.routes")
const bannerRoutes = require("../modules/banner/banner.routes")

 router.use("/auth", authRoutes)
 router.use("/book",bookRoutes)
router.use("/genre",genreRoutes)
router.use("/author",authorRoutes)
router.use("/user",userRoutes)
router.use("/banner",bannerRoutes)
 
 module.exports= router;