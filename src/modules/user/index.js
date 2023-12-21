
const UserController = require("./user.controller")
const UserService = require("./user.service")
const UsersServie = require('../auth/auth.service')

const userService = new UsersServie()
const userSvc = new UserService()
const userCtrl = new UserController({userSvc, userService})


module.exports= userCtrl