require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const err = require('./middlewares/error');
const router = require('./routes');
// const corsMiddleware = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/loger');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors({ origin: 'kazarinov.mesto.nomoredomains.icu' }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(err);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
