const Test = require('../model/tests');
const { HttpCode } = require('../helpers/constants');

const getTheoryTest = async (req, res, next) => {
  try {
    const tests = await Test.getTheoryTest(req.query);
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        tests,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getTechTest = async (req, res, next) => {
  try {
    const tests = await Test.getTechnicalTest();
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        tests,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getTheoryTest,
  getTechTest,
};
