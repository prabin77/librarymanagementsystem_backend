const GenreController = require("./genre.contoller")
const GenreServices =require("./genre.services")

const genreSvc = new GenreServices()
const genreCtrl = new GenreController(genreSvc)

module.exports= {genreCtrl}