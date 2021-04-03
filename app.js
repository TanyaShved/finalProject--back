const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { HttpCode } = require('./helpers/constants');

const testRouter = require('./routers/api/test');
const usersRouter = require('./routers/api/users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/test', testRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res
    .status(err.status || HttpCode.INTERNAL_SERAVER_ERROR)
    .json({ message: err.message });
});

module.exports = app;