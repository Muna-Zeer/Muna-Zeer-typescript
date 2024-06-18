"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgRouter = void 0;
const express_1 = __importDefault(require("express"));
const imageController_1 = require("../controller/imageController");
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.ImgRouter = router;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
//upload image by the user
router.post('/upload', upload.single("image"), imageController_1.imgController.uploadImage);
// router file
//Resize the width and the height of the image
router.post('/resize', imageController_1.ImgResizeController.resizeImg);
//Make crop for the images
router.post('/crop', imageController_1.ImgCroppedController.cropImg);
//Route for  download image processing
router.get('/download', imageController_1.ImgDownloadController.downloadImg);
//Route for  filter the image based on the blur or grayScale
router.get('/filter', imageController_1.ImgFilterController.applyFilterImg);
//Route for  waterMark
router.post('/watermark', ImgWaterMArkController.waterMarkImg);
