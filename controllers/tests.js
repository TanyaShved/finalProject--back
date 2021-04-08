const Test = require('../model/tests');
const { HttpCode } = require('../helpers/constants');

const getTheoryRandomTest = async (req, res, next) => {
  try {
    const test = await Test.getTheoryRandomTest(req.query);
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        test,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getTechnicalRandomTest = async (req, res, next) => {
  try {
    const test = await Test.getTechnicalRandomTest();
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        test,
      },
    });
  } catch (e) {
    next(e);
  }
};

const theoryAnswer = async (req, res, next) => {
  try {
    const answer = await req.body;
    const theoryTest = await Test.getTheoryTest();

    const rightAnswer = Test.getQtyAnsw(answer, theoryTest);
    const incorrectAnswer = 12 - rightAnswer;

    return res.status(200).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        rightAnswer,
        incorrectAnswer,
      },
    });
  } catch (e) {
    next(e);
  }
};

const techAnswer = async (req, res, next) => {
  try {
    const answer = await req.body;
    const techTest = await Test.getTechnicalTest();

    const rightAnswer = Test.getQtyAnsw(answer, techTest);
    const incorrectAnswer = 12 - rightAnswer;

    return res.status(200).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        rightAnswer,
        incorrectAnswer,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getTheoryRandomTest,
  getTechnicalRandomTest,
  theoryAnswer,
  techAnswer,
};
