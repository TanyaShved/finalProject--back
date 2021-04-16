const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
const { HttpCode } = require('./helpers/constants');

const testRouter = require('./routers/test');
const usersRouter = require('./routers/auth');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));
app.use(express.urlencoded({ extended: false }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  handler: (req, res, next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad Request',
      message: 'Too many requests, please try again later',
    });
  },
});

app.use('*', apiLimiter);
app.use('/test', testRouter);
app.use('/auth', usersRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res
    .status(err.status || HttpCode.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
});

module.exports = app;
