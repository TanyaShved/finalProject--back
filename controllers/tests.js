const Test = require('../model/tests');
const { HttpCode } = require('../helpers/constants');

const getTheoryTest = async (req, res, next) => {
  try {
    const theoryTest = await Test.getTheoryTest(req.query);
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        theoryTest,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getTechTest = async (req, res, next) => {
  try {
    const techTest = await Test.getTechnicalTest();
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        techTest,
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
