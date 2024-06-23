const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

import { Request, Response } from "express";
import {
  BadClientReq,
  SuccessUserReq,
  BadServerReq,
} from "../utils/errorHandler";
interface RotateRequestBody {
  rotateValue: number;
  imageUrl: string;
}

// Image Controller
export const imgController = {
  uploadImage: (req: Request, res: Response) => {
    console.log("req.file", req.file);

    if (!req.file) {
      return BadClientReq(res, "Invalid uploaded file");
    }
    return SuccessUserReq(res, "file uploaded successfully");
  },
};

// Display images
type Callback = (
  error: NodeJS.ErrnoException | null,
  filesURL: string[] | null
) => void;

export const getUploadedImages = (callback: Callback): void => {
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

// Process Path Function
const ProcessPath = (imageUrl: string) => {
  if (!imageUrl) {
    throw new Error("No image URL provided");
  }
  const imagePath = path.join(__dirname, "../", imageUrl);
  console.log("imagePath", imagePath);

  const filename = path.basename(imagePath);
  console.log("filename", filename);
  return { imagePath, filename };
};

// Image Resize Controller
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
//Rotate Image
export const ImageRotating = {
  ImgRotate: async (req: Request<any,any,RotateRequestBody>, res: Response) => {
    const { rotateValue, imageUrl } = req.body;
    const parsedRotateValue = parseInt(rotateValue, 10);

    if (isNaN(parsedRotateValue)) {
      throw new Error('rotateValue must be a valid number');
    }
    try {
      const { imagePath, filename } = ProcessPath(imageUrl);

      const rotatedFilename = `rotate-${filename}`;
      const rotatedImagePath = path.join(
        __dirname,
        '../uploads',
        rotatedFilename
      );

      await sharp(imagePath)
        .rotate(parsedRotateValue, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFile(rotatedImagePath);

      const rotatedImageUrl = `/uploads/${rotatedFilename}`;
      res.status(200).json({ success: true, message:"Successful rotated your image return to main page" });
    } catch (error) {
      console.error('Error rotating image:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },
};

// Image Crop Controller
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
          left: parseInt(left as string),
          top: parseInt(top as string),
          width: parseInt(width as string),
          height: parseInt(height as string),
        })
        .toFile(croppedImagePath);
      return res.render("detail", { imageUrl: `/uploads/${croppedFilename}` });
    } catch (error) {
      console.error(error);
      return BadServerReq(res, error);
    }
  },
};

// Image Download Controller
export const ImgDownloadController = {
  downloadImg: async (req: Request, res: Response) => {
    try {
      const imageUrl: string = req.query.imageUrl as string;
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

// Apply blur filter to an image
const applyBlurFilter = async (
  imagePath: string,
  filterImgPath: string,
  blurLevel: number
) => {
  await sharp(imagePath).blur(blurLevel).toFile(filterImgPath);
};

// Apply grayscale filter to an image
const applyGrayScaleFilter = async (
  imagePath: string,
  filterImgPath: string
) => {
  await sharp(imagePath).grayscale().toFile(filterImgPath);
};

// Image Filter Controller
export const ImgFilterController = {
  applyFilterImg: async (req: Request, res: Response) => {
    try {
      const { filter, imageUrl, blurLevel } = req.query as {
        filter: string;
        imageUrl: string;
        blurLevel?: string;
      };
      console.log("imageUrl", imageUrl);
      console.log("blurLevel", blurLevel);

      if (!filter || !imageUrl) {
        return BadClientReq(res, "Invalid filter or imageUrl provided");
      }

      console.log("Image URL:", imageUrl);
      const { imagePath, filename } = ProcessPath(imageUrl as string);
      const filterFilename = `filter-${filename}`;
      const filterImagePath = path.join(
        __dirname,
        "../uploads",
        filterFilename
      );

      switch (filter) {
        case "grayscale":
          await applyGrayScaleFilter(imagePath, filterImagePath);
          break;
        case "blur":
          await applyBlurFilter(
            imagePath,
            filterImagePath,
            parseInt(blurLevel || "0")
          );
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

// Image Watermark Controller
export const addTextToImage={
 addText:async(req:Request,res:Response)=>{
  try {
    const{textValue,imageUrl}=req.body;
    const svgImage = `
    <svg>
      <style>
        .title {  font-size: 16px; font-weight: bold; }
      </style>
      <text x="50%" y="50%" text-anchor="middle" class="title">${textValue}</text>
    </svg>
  `;

  //Convert SVG into Buffer
  const svgBuffer=Buffer.from(svgImage);
  // Extract filename and path
  const { imagePath, filename } = ProcessPath(imageUrl);
  const textedFilename = `texted-${filename}`;
  const textedImagePath = path.join(
    __dirname,
    "../uploads",
    textedFilename
  );
  await sharp(imagePath).composite([{ input: svgBuffer }]).png().toBuffer().then((outputBuffer: Buffer) => {
    // Save the modified image to the filesystem
    sharp(outputBuffer).toFile(textedImagePath, (err: Error) => {
        if (err) {
            console.error('Error saving text image:', err);
            throw err;
        }
        res.render('detail', { imageUrl: `/uploads/${textedFilename}` });
    });
  });

  } catch (error) {
    console.error('Error adding text to image:', error);
    res.status(500).send('Error adding text to image');
  }
 } 
}