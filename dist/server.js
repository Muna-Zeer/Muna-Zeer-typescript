"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageRoutes_1 = require("./routes/imageRoutes");
const path_1 = __importDefault(require("path"));
const imageController_1 = require("./controller/imageController");
const app = (0, express_1.default)();
const viewsPath = path_1.default.join(__dirname, 'views');
const viewsPath2 = path_1.default.join(__dirname, 'partials');
app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Routes
app.use('/images', imageRoutes_1.ImgRouter);
app.get('/', (req, res) => {
    (0, imageController_1.getUploadedImages)((err, fileUrls) => {
        if (err) {
            console.log("Error reading fileUrls", err);
            return res.status(500).send("Error while reading fileUrls");
        }
        res.render("index", { fileUrls, imageUrl: req.query.image });
        console.log("Read fileUrls successfully", fileUrls);
    });
});
app.get('/detail', (req, res) => {
    const imageUrl = req.query.image;
    res.render('detail', { imageUrl });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
