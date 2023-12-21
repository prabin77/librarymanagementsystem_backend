const BannerController = require("./banner.controller")
const BannerService= require("./banner.service")

const bannerSvc= new BannerService();
const bannerCtrl = new BannerController(bannerSvc);

module.exports= {
    bannerCtrl

}