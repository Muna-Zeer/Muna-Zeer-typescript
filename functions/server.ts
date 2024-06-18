import express from 'express';
import serverless from 'serverless-http';
import { ImgRouter } from '../src/routes/imageRoutes';
import path from 'path';
import { getUploadedImages } from '../src/controller/imageController';

const app = express();

const viewsPath = path.join(__dirname, '../views'); 
const viewsPath2 = path.join(__dirname, '../partials');

app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/images', ImgRouter);

app.get('/', (req, res) => {
  getUploadedImages((err, fileUrls) => {
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

const handler = serverless(app);

export { handler as default };
