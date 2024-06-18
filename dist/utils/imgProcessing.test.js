var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const request = require("superset");
const fs = require("fs");
const express = require("express");
const { imgController } = require("../controller/imageController");
const { ImgResizeController } = require("../controller/imageController");
const { ImgCroppedController } = require("../controller/imageController");
const { ImgDownloadController } = require("../controller/imageController");
const { ImgFilterController } = require("../controller/imageController");
const { ImgWaterMArkController } = require("../controller/imageController");
//Mock testing for img processing
jest.mock("sharp", () => {
    const sharpTest = {
        resize: jest.fn().mockReturnThis(),
        toFile: jest.fn().mockReturnThis(),
        grayscale: jest.fn().mockReturnThis(),
        blur: jest.fn().mockReturnThis(),
        composite: jest.fn().mockReturnThis(),
    };
    return jest.fn(() => sharpTest);
});
describe("Image controllers functions", () => {
    const app = express();
    app.use(express.json());
    test("Check uploading file image", () => __awaiter(this, void 0, void 0, function* () {
        const req = {
            file: {},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        imgController.uploadImage(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "uploaded image successfully" });
    }));
});
//Test resize image parameters
test("resize image parameters", () => __awaiter(this, void 0, void 0, function* () {
    const req = {
        body: { width: 200, height: 200, imageUrl: "test.jpeg" },
    };
    const res = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    yield ImgResizeController.resizeImg(req, res);
    expect(res.render).toHaveBeenCalled(),
        expect(res.render.mock.calls[0][0]).toBe("detail"),
        expect(res.render.mock.calls[0][1].imageUrl).toBeDefined();
}));
//Test cropped images
test("cropped image exceed the maximum size", () => __awaiter(this, void 0, void 0, function* () {
    const req = {
        body: {
            width: 200,
            height: 200,
            top: 90,
            left: 120,
            imageUrl: "test.jpeg",
        },
    };
    const res = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    yield ImgCroppedController.cropImg(req, res);
    expect(res.render).toHaveBeenCalled();
    expect(res.render.mock.calls[0][0]).toBe("detail");
    expect(res.render.mock.calls[0][1].imageUrl).toBeDefined();
}));
//Test image download
test("test download and image", () => __awaiter(this, void 0, void 0, function* () {
    const req = {
        query: { imageUrl: "test.jpeg" },
    };
    const res = {
        download: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    yield ImgDownloadController.downloadImg(req, res);
    expect(res.download).toHaveBeenCalled();
}));
//Test apply filter image blur or grayscale
test("image filter blur or grayscale", () => __awaiter(this, void 0, void 0, function* () {
    const req = {
        query: { filter: "grayscale", imageUrl: "test.jpg" },
    };
    const res = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    yield ImgFilterController.applyFilterImg(req, res);
    expect(res.render).toHaveBeenCalled();
    expect(res.render.mock.calls[0][0]).toBe("detail");
    expect(res.render.mock.calls[0][1].imageUrl).toBeDefined();
}));
//Test watermark image
test("ImgWaterMArkController", () => __awaiter(this, void 0, void 0, function* () {
    const req = {
        body: { top: 10, left: 10, text: "Watermark", imageUrl: "test.jpg" },
    };
    const res = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    yield ImgWaterMArkController.waterMarkImg(req, res);
    expect(res.render).toHaveBeenCalled();
    expect(res.render.mock.calls[0][0]).toBe("detail");
    expect(res.render.mock.calls[0][1].imageUrl).toBeDefined(); // Assert imageUrl is defined
}));
