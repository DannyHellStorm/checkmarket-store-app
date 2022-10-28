import config from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

import * as mapping from './model/mapping.js';
import sequelize from './sequelize.js';
import router from './routes/index.js';
import ErrorHandler from './middleware/ErrorHandler.js';

const PORT = process.env.PORT || 6000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('static'));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(fileUpload());
app.use('/api/v1', router);

// обработка ошибок
app.use(ErrorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log('Сервер запущен на порту', PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
