import express from "express";
import { imgController,ImgResizeController,ImgCroppedController, ImgDownloadController,
    ImgFilterController,ImgWaterMArkController
} from "../controller/imageController";
import { getUploadedImages } from "../controller/imageController";

import path from "path";
import multer from "multer";
const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  });
  
  const upload = multer({ storage: storage })

//upload image by the user
router.post('/upload', upload.single("image"), imgController.uploadImage);
// router file

//Resize the width and the height of the image
router.post('/resize',ImgResizeController.resizeImg)

//Make crop for the images
router.post('/crop',ImgCroppedController.cropImg)

//Route for  download image processing
router.get('/download',ImgDownloadController.downloadImg)

//Route for  filter the image based on the blur or grayScale
router.get('/filter',ImgFilterController.applyFilterImg)

//Route for  waterMark
router.get('/watermark',ImgWaterMArkController.waterMarkImg)
export { router as ImgRouter };
