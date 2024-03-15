"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var imageRoutes_1 = require("./routes/imageRoutes");
var path_1 = require("path");
var app = (0, express_1.default)();
var viewsPath = path_1.default.join(__dirname, 'views');
var viewsPath2 = path_1.default.join(__dirname, 'partials');
app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Routes
app.use('/images', imageRoutes_1.ImgRouter);
app.get('/', function (req, res) {
    res.render('index');
});
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
