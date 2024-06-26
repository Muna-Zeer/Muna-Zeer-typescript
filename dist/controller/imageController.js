"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgWaterMarkController = exports.ImgFilterController = exports.ImgDownloadController = exports.ImgCroppedController = exports.ImgResizeController = exports.getUploadedImages = exports.imgController = void 0;
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const errorHandler_1 = require("../utils/errorHandler");
// Image Controller
exports.imgController = {
    uploadImage: (req, res) => {
        console.log("req.file", req.file);
        if (!req.file) {
            return (0, errorHandler_1.BadClientReq)(res, "Invalid uploaded file");
        }
        return (0, errorHandler_1.SuccessUserReq)(res, "file uploaded successfully");
    },
};
const getUploadedImages = (callback) => {
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
exports.getUploadedImages = getUploadedImages;
// Process Path Function
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
// Image Resize Controller
exports.ImgResizeController = {
    resizeImg: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { width, height, imageUrl } = req.body;
            console.log("Image URL:", imageUrl);
            const { imagePath, filename } = ProcessPath(imageUrl);
            if (!width || !height) {
                return (0, errorHandler_1.BadClientReq)(res, "Width and height are required");
            }
            const resizedFilename = `resize-${filename}`;
            const resizedImagePath = path.join(__dirname, "../uploads", resizedFilename);
            yield sharp(imagePath)
                .resize({
                width: parseInt(width),
                height: parseInt(height),
            })
                .toFile(resizedImagePath);
            return res.render("detail", { imageUrl: `/uploads/${resizedFilename}` });
        }
        catch (error) {
            return (0, errorHandler_1.BadServerReq)(res, error);
        }
    }),
};
// Image Crop Controller
exports.ImgCroppedController = {
    cropImg: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { width, height, top, left, imageUrl } = req.body;
            console.log("Image URL:", imageUrl);
            console.log("Crop parameters:", { width, height, top, left });
            if (!left || !top || !width || !height) {
                return (0, errorHandler_1.BadClientReq)(res, "Invalid parameters passed to cropImg");
            }
            console.log("Image URL:", imageUrl);
            const { imagePath, filename } = ProcessPath(imageUrl);
            const croppedFilename = `crop-${filename}`;
            const croppedImagePath = path.join(__dirname, "../uploads", croppedFilename);
            yield sharp(imagePath)
                .extract({
                left: parseInt(left),
                top: parseInt(top),
                width: parseInt(width),
                height: parseInt(height),
            })
                .toFile(croppedImagePath);
            return res.render("detail", { imageUrl: `/uploads/${croppedFilename}` });
        }
        catch (error) {
            console.error(error);
            return (0, errorHandler_1.BadServerReq)(res, error);
        }
    }),
};
// Image Download Controller
exports.ImgDownloadController = {
    downloadImg: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const imageUrl = req.query.imageUrl;
            const { imagePath } = ProcessPath(imageUrl);
            if (!imagePath) {
                return (0, errorHandler_1.BadClientReq)(res, "No image URL provided");
            }
            console.log("Image URL:", imagePath);
            return res.download(imagePath);
        }
        catch (error) {
            return (0, errorHandler_1.BadServerReq)(res, error);
        }
    }),
};
// Apply blur filter to an image
const applyBlurFilter = (imagePath, filterImgPath, blurLevel) => __awaiter(void 0, void 0, void 0, function* () {
    yield sharp(imagePath).blur(blurLevel).toFile(filterImgPath);
});
// Apply grayscale filter to an image
const applyGrayScaleFilter = (imagePath, filterImgPath) => __awaiter(void 0, void 0, void 0, function* () {
    yield sharp(imagePath).grayscale().toFile(filterImgPath);
});
// Image Filter Controller
exports.ImgFilterController = {
    applyFilterImg: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { filter, imageUrl, blurLevel } = req.query;
            console.log("imageUrl", imageUrl);
            console.log("blurLevel", blurLevel);
            if (!filter || !imageUrl) {
                return (0, errorHandler_1.BadClientReq)(res, "Invalid filter or imageUrl provided");
            }
            console.log("Image URL:", imageUrl);
            const { imagePath, filename } = ProcessPath(imageUrl);
            const filterFilename = `filter-${filename}`;
            const filterImagePath = path.join(__dirname, "../uploads", filterFilename);
            switch (filter) {
                case "grayscale":
                    yield applyGrayScaleFilter(imagePath, filterImagePath);
                    break;
                case "blur":
                    yield applyBlurFilter(imagePath, filterImagePath, parseInt(blurLevel || "0"));
                    break;
                default:
                    return (0, errorHandler_1.BadClientReq)(res, "Invalid filter type.");
            }
            return res.render("detail", { imageUrl: `../uploads/${filterFilename}` });
        }
        catch (error) {
            console.error("Error applying filter:", error);
            return (0, errorHandler_1.BadServerReq)(res, error);
        }
    }),
};
// Image Watermark Controller
exports.ImgWaterMarkController = {
    waterMarkImg: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { top, left, text, imageUrl } = req.body;
            console.log("Received parameters:", { top, left, text, imageUrl });
            if (!top || !left || !text || !imageUrl) {
                return (0, errorHandler_1.BadClientReq)(res, "Invalid parameters or no imageUrl provided");
            }
            console.log("Image URL:", imageUrl);
            const { imagePath, filename } = ProcessPath(imageUrl);
            const filterFilename = `watermark-${filename}`;
            const filterImagePath = path.join(__dirname, "../uploads", filterFilename);
            console.log("Processing image:", imagePath);
            yield sharp(imagePath)
                .composite([
                {
                    input: Buffer.from(`<svg><text x="${left}" y="${top}" font-family="Arial" font-size="16" fill="white">${text}</text></svg>`),
                    gravity: "southeast",
                },
            ])
                .toFile(filterImagePath);
            console.log("Watermark added successfully.");
            return res.render("detail", { imageUrl: `../uploads/${filterFilename}` });
        }
        catch (error) {
            console.error("Error processing image:", error);
            return (0, errorHandler_1.BadServerReq)(res, error);
        }
    }),
};
