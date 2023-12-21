const AuthorController = require("./author.contoller")
const AuthorServices =require("./author.services")

const authorSvc = new AuthorServices()
const authorCtrl = new AuthorController(authorSvc)

module.exports= {authorCtrl}