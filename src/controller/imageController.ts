const fs = require("fs");
import sharp from "sharp";
// import multer from "multer";
import path from "path";

import { Request, Response } from "express";
import {
  BadServerReq,
  BadClientReq,
  SuccessUserReq,
} from "../utils/errorHandler";
//upload img by user
export const imgController = {
  uploadImage: (req: Request, res: Response) => {
    console.log("req.file", req.file);

    if (!req.file) {
      return BadClientReq(res, "Invalid uploaded file");
    }
    return SuccessUserReq(res, "file uploaded successfully");
  },
};

//Display images
export const getUploadedImages = (callback) => {
  const uploadDir = path.join(__dirname, "../uploads");

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading files:", err);
      return callback(err, null);
    }

    const fileUrls = files.map((file) => `/uploads/${file}`);
    callback(null, fileUrls);
  });
};

const ProcessPath = (imageUrl) => {
  if (!imageUrl) {
    throw new Error("No image URL provided");
  }
  const imagePath = path.join(__dirname, "../", imageUrl);
  console.log("imagePath", imagePath);

  const filename = path.basename(imagePath);
  console.log("filename", filename);
  return { imagePath, filename };
};

export const ImgResizeController = {
  resizeImg: async (req: Request, res: Response) => {
    try {
      const { width, height, imageUrl } = req.body;

      console.log("Image URL:", imageUrl);
      const { imagePath, filename } = ProcessPath(imageUrl);

      if (!width || !height) {
        return BadClientReq(res, "Width and height are required");
      }

      const resizedFilename = `resize-${filename}`;
      const resizedImagePath = path.join(
        __dirname,
        "../uploads",
        resizedFilename
      );

      await sharp(imagePath)
        .resize({
          width: parseInt(width),
          height: parseInt(height),
        })
        .toFile(resizedImagePath);

      return res.render("detail", { imageUrl: `/uploads/${resizedFilename}` });
    } catch (error) {
      return BadServerReq(res, error);
    }
  },
};
//crop Img
export const ImgCroppedController = {
  cropImg: async (req: Request, res: Response) => {
    try {
      const { width, height, top, left, imageUrl } = req.body;
      console.log("Image URL:", imageUrl);
      console.log("Crop parameters:", { width, height, top, left });

      if (!left || !top || !width || !height) {
        return BadClientReq(res, "Invalid parameters passed to cropImg");
      }
      console.log("Image URL:", imageUrl);
      const { imagePath, filename } = ProcessPath(imageUrl);
      const croppedFilename = `crop-${filename}`;
      const croppedImagePath = path.join(
        __dirname,
        "../uploads",
        croppedFilename
      );
      await sharp(imagePath)
        .extract({
          left: parseInt(left),
          top: parseInt(top),
          width: parseInt(width),
          height: parseInt(height),
        })
        .toFile(croppedImagePath);
      return res.render("detail", { imageUrl: `/uploads/${croppedFilename}` });
    } catch (error) {
      console.error(error);
      return BadServerReq(res, error);
    }
  },
};
//download Img Process
export const ImgDownloadController = {
  downloadImg: async (req: Request, res: Response) => {
    try {
      const imageUrl: string = req.query.imageUrl;
      const { imagePath } = ProcessPath(imageUrl);

      if (!imagePath) {
        return BadClientReq(res, "No image URL provided");
      }

      console.log("Image URL:", imagePath);
      return res.download(imagePath);
    } catch (error) {
      return BadServerReq(res, error);
    }
  },
};

//apply filter to images by blur and grayscale
export const ImgFilterController = {
  applyFilterImg: async (req: Request, res: Response) => {
    try {
      const { filter } = req.body;
      if (!filter) {
        return BadClientReq(res, "Invalid filter provided");
      } else {
        //   let filterImgAction = sharp.Sharp;
        switch (filter) {
          case "grayscale":
            sharp(`req.file.path`)
              .grayscale()
              .toFile(`file-${req.file.filename}`);
            break;
          case "blur":
            sharp(`req.file.path`).blur().toFile(`file-${req.file.filename}`);
          default:
            return BadClientReq(res, "Invalid filter type.");
        }
      }
      return SuccessUserReq(
        res,
        "Filter type is supported and successfully applied."
      );
    } catch (error) {
      return BadServerReq(res, error);
    }
  },
};

//watermark to images
export const ImgWaterMArkController = {
  waterMarkImg: async (req: Request, res: Response) => {
    try {
      const { top, left } = req.body;
      const imgFile = req.file.path;
      await sharp(imgFile)
        .composite([
          {
            input: imgFile,
            top: parseInt(top),
            left: parseInt(left),
            gravity: "southeast",
          },
        ])
        .toFile(`watermarked-${req.file.filename}`);
      return SuccessUserReq(res, "Watermark applied successfully.");
    } catch (error) {
      return BadServerReq(res, error);
    }
  },
};
export const processImg = async (req: Request, res: Response) => {
  try {
    const { action } = req.body;
    switch (action) {
      case "resize":
        await ImgResizeController.resizeImg(req, res);
        break;
      case "crop":
        await ImgCroppedController.cropImg(req, res);
        break;
      case "download":
        await ImgDownloadController.downloadImg(req, res);
        break;
      case "filter":
        await ImgFilterController.applyFilterImg(req, res);
        break;
      case "watermark":
        await ImgWaterMArkController.waterMarkImg(req, res);
        break;
      default:
        res.status(404).json({ message: "Invalid Action " });
    }
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
