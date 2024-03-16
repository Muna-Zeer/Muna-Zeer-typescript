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
  test("Check uploading file image", async () => {
    const req = {
      file: {},
    };
    const res = { send: jest.fn() };
    imgController.uploadImage(req, res);
    expect(res.send).toHaveBeenCalledWith("uploaded image successfully");
  });
});

//Test resize image parameters

test("resize image parameters", async () => {
  const req = {
    body: { width: 200, height: 200, imageUrl: "test.jpeg" },
  };
  const res = {
    render: jest.fn(),
  };
  await ImgResizeController.resizeImg(req, res);
  expect(res.render).toHaveBeenCalled(),
    expect(res.render.mock.calls[0][0]).toBe("detail"),
    expect(res.render.mock.calls[0][1].imageUrl).toBeDefined();
});

//Test cropped images
test("cropped image exceed the maximum size", async () => {
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
  };
  await ImgCroppedController.cropImg(req, res);
  expect(res.render).toHaveBeenCalled();
  expect(res.render.mock.calls[0][0]).toBe("detail");
  expect(res.render.mock.calls[0][1].imageUrl).toBeDefined();
});

//Test image download
test("test download and image", async () => {
  const req = {
    query: { imageUrl: "test.jpeg" },
  };
  const res = {
    download: jest.fn(),
  };
  await ImgDownloadController.downloadImg(req, res);
  expect(res.download).toHaveBeenCalled();
});

//Test apply filter image blur or grayscale
test("image filter blur or grayscale", async () => {
  const req = {
    query: { filter: "grayscale", imageUrl: "test.jpg" },
  };
  const res = {
    render: jest.fn(),
  };
  await ImgFilterController.applyFilterImg(req, res);
  expect(res.render).toHaveBeenCalled();
  expect(res.render.mock.calls[0][0]).toBe("detail");
  expect(res.render.mock.calls[0][1].imageUrl).toBeDefined();
});

//Test watermark image

test("ImgWaterMArkController", async () => {
  const req = {
    body: { top: 10, left: 10, text: "Watermark", imageUrl: "test.jpg" },
  };
  const res = {
    render: jest.fn(),
  };

  await ImgWaterMArkController.waterMarkImg(req, res);
  expect(res.render).toHaveBeenCalled();
  expect(res.render.mock.calls[0][0]).toBe("detail");
  expect(res.render.mock.calls[0][1].imageUrl).toBeDefined(); // Assert imageUrl is defined
});
