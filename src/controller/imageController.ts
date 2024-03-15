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


//Apply blur filter to an image 
const applyBlurFilter=async(imagePath:string,filterImgPath:string, blurLevel: number)=>{
await sharp(imagePath).blur(blurLevel).toFile(filterImgPath);
}
//Apply grayscale filter to an image 
const applyGrayScaleFilter=async(imagePath:string,filterImgPath:string)=>{
await sharp(imagePath).grayscale().toFile(filterImgPath);
}

export const ImgFilterController = {
  applyFilterImg: async (req: Request, res: Response) => {
    try {
      const { filter, imageUrl, blurLevel } = req.query;
      console.log("imageUrl", imageUrl);
      console.log("blurLevel", blurLevel);

      if (!filter || !imageUrl) {
        return BadClientReq(res, "Invalid filter or imageUrl provided");
      }

      console.log("Image URL:", imageUrl);
      const { imagePath, filename } = ProcessPath(imageUrl as string);
      const filterFilename = `filter-${filename}`;
      const filterImagePath = path.join(__dirname, "../uploads", filterFilename);

      switch (filter) {
        case "grayscale":
          await applyGrayScaleFilter(imagePath, filterImagePath);
          break;
        case "blur":
       
          await applyBlurFilter(imagePath, filterImagePath, parseInt(blurLevel || "0"));
          break;
        default:
          return BadClientReq(res, "Invalid filter type.");
      }

      return res.render("detail", { imageUrl: `../uploads/${filterFilename}` });
    } catch (error) {
      console.error("Error applying filter:", error);
      return BadServerReq(res, error);
    }
  },
};
export const ImgWaterMArkController = {
  waterMarkImg: async (req: Request, res: Response) => {
      try {
          const { top, left, text, imageUrl } = req.body;

          if (!top || !left || !text || !imageUrl) {
              return BadClientReq(res, "Invalid parameters or no imageUrl provided");
          }

          console.log("Image URL:", imageUrl);
          const { imagePath, filename } = ProcessPath(imageUrl as string);
          const filterFilename = `watermark-${filename}`;
          const filterImagePath = path.join(__dirname, "../uploads", filterFilename);

          await sharp(imagePath)
              .composite([
                  {
                      input: Buffer.from(`<svg><text x="${left}" y="${top}" font-family="Arial" font-size="16" fill="white">${text}</text></svg>`),
                      gravity: "southeast",
                  },
              ])
              .toFile(filterImagePath);

          return res.render("detail", { imageUrl: `../uploads/${filterFilename}` });
      } catch (error) {
          return BadServerReq(res, error);
      }
  },
};