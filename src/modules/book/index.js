const BookController = require("./book.controller")
const BookService= require("./book.service")

const bookSvc= new BookService();
const bookCtrl = new BookController(bookSvc);

module.exports= {
    bookCtrl

}