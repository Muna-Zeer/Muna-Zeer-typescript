"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgRouter = void 0;
var express_1 = require("express");
var imageController_1 = require("../controller/imageController");
var multer_1 = require("multer");
var path_1 = require("path");
var router = express_1.default.Router();
exports.ImgRouter = router;
var storage = multer_1.default.diskStorage({
    destination: path_1.default.join(__dirname, '../uploads'),
    filename: function (req, file, cb) {
        var ext = path_1.default.extname(file.originalname);
        cb(null, "".concat(file.fieldname, "-").concat(Date.now()).concat(ext));
    }
});
var upload = (0, multer_1.default)({ storage: storage });
//upload image by the user
router.post('/upload', upload.single("image"), imageController_1.imgController.uploadImage);
//Resize the width and the height of the image
router.post('/resize', imageController_1.ImgResizeController.resizeImg);
//make crop for the images
router.post('/crop', imageController_1.ImgCroppedController.cropImg);
//Route for  download image processing
router.get('/download', imageController_1.ImgDownloadController.downloadImg);
//Route for  filter the image based on the blur or grayScale
router.get('/filter', imageController_1.ImgFilterController.applyFilterImg);
//Route for  waterMark
router.get('/watermark', imageController_1.ImgWaterMArkController.waterMarkImg);
