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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImg = exports.ImgWaterMArkController = exports.ImgFilterController = exports.ImgDownloadController = exports.ImgCroppedController = exports.ImgResizeController = exports.imgController = void 0;
var path = require("path");
var fs = require("fs");
var sharp_1 = require("sharp");
//upload img by user
exports.imgController = {
    uploadImage: function (req, res) {
        console.log("req.file", req.file);
        if (!req.file) {
            return res.status(400).json({ message: "no file uploaded" });
        }
        res.status(200).json({ message: "file uploaded successfully" });
    },
};
//Resizing an image
exports.ImgResizeController = {
    resizeImg: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, width, height, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, width = _a.width, height = _a.height;
                    if (!width || !height) {
                        return [2 /*return*/, res
                                .status(400)
                                .json({ message: "width and height are required" })];
                    }
                    return [4 /*yield*/, (0, sharp_1.default)(req.file.path)
                            .resize({
                            width: parseInt(width),
                            height: parseInt(height),
                        })
                            .toFile("resize-".concat(req.file.filename))];
                case 1:
                    _b.sent();
                    return [2 /*return*/, res.status(200).json({ message: "resized Img successfully" })];
                case 2:
                    error_1 = _b.sent();
                    console.error(error_1);
                    return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
                case 3: return [2 /*return*/];
            }
        });
    }); },
};
//crop Img
exports.ImgCroppedController = {
    cropImg: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, width, height, top_1, left, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, width = _a.width, height = _a.height, top_1 = _a.top, left = _a.left;
                    if (!left || !top_1 || !width || !height) {
                        return [2 /*return*/, res
                                .status(400)
                                .json({ message: "Invalid parameters passed to cropImg" })];
                    }
                    return [4 /*yield*/, (0, sharp_1.default)(req.file.path)
                            .extract({
                            left: parseInt(left),
                            top: parseInt(top_1),
                            width: parseInt(width),
                            height: parseInt(height),
                        })
                            .toFile("cropped-".concat(req.file.filename))];
                case 1:
                    _b.sent();
                    return [2 /*return*/, res.status(200).json({ message: "Image cropped successfully" })];
                case 2:
                    error_2 = _b.sent();
                    console.error(error_2);
                    res.status(500).json({ message: "Image cropped failed" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
};
//download Img Process
exports.ImgDownloadController = {
    downloadImg: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var imgPath;
        return __generator(this, function (_a) {
            try {
                imgPath = req.file.path;
                return [2 /*return*/, res.download(imgPath)];
            }
            catch (error) {
                console.error(error);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            }
            return [2 /*return*/];
        });
    }); }
};
//apply filter to images by blur and grayscale
exports.ImgFilterController = {
    applyFilterImg: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var filter;
        return __generator(this, function (_a) {
            try {
                filter = req.body.filter;
                if (!filter) {
                    return [2 /*return*/, res.status(404).json({ message: "Invalid filter provided" })];
                }
                else {
                    //   let filterImgAction = sharp.Sharp;
                    switch (filter) {
                        case "grayscale":
                            (0, sharp_1.default)("req.file.path")
                                .grayscale()
                                .toFile("file-".concat(req.file.filename));
                            break;
                        case "blur":
                            (0, sharp_1.default)("req.file.path").blur().toFile("file-".concat(req.file.filename));
                        default:
                            return [2 /*return*/, res.status(400).json({ message: "Invalid filter type." })];
                    }
                }
                return [2 /*return*/, res.status(200).json({ message: "Filter type is supported and successfully applied." })];
            }
            catch (error) {
                console.error(error);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            }
            return [2 /*return*/];
        });
    }); }
};
//watermark to images
exports.ImgWaterMArkController = {
    waterMarkImg: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, top_2, left, imgFile, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, top_2 = _a.top, left = _a.left;
                    imgFile = req.file.path;
                    return [4 /*yield*/, (0, sharp_1.default)(imgFile)
                            .composite([{ input: imgFile, top: parseInt(top_2),
                                left: parseInt(left), gravity: "southeast" }]).toFile("watermarked-".concat(req.file.filename))];
                case 1:
                    _b.sent();
                    return [2 /*return*/, res.status(200).json({ message: "Watermark applied successfully." })];
                case 2:
                    error_3 = _b.sent();
                    console.error(error_3);
                    return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
var processImg = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var action, _a, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                action = req.body.action;
                _a = action;
                switch (_a) {
                    case "resize": return [3 /*break*/, 1];
                    case "crop": return [3 /*break*/, 3];
                    case "download": return [3 /*break*/, 5];
                    case "filter": return [3 /*break*/, 6];
                    case "watermark": return [3 /*break*/, 7];
                }
                return [3 /*break*/, 8];
            case 1: return [4 /*yield*/, exports.ImgResizeController.resizeImg(req, res)];
            case 2:
                _b.sent();
                return [3 /*break*/, 9];
            case 3: return [4 /*yield*/, exports.ImgCroppedController.cropImg(req, res)];
            case 4:
                _b.sent();
                return [3 /*break*/, 9];
            case 5: 
            // await downloadImg(req,res);
            return [3 /*break*/, 9];
            case 6: 
            // await applyFilterImg(req,res);
            return [3 /*break*/, 9];
            case 7: 
            //  await applyWaterMark(req,res);
            return [3 /*break*/, 9];
            case 8:
                res.status(404).json({ message: "Invalid Action " });
                _b.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_4 = _b.sent();
                console.error("error", error_4);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.processImg = processImg;
