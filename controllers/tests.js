const Test = require('../model/tests');
const { HttpCode } = require('../helpers/constants');

const getTheoryTest = async (req, res, next) => {
  try {
    const test = await Test.getTheoryTest(req.query);
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

const getTechTest = async (req, res, next) => {
  try {
    const test = await Test.getTechnicalTest();
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
  getTheoryTest,
  getTechTest,
  theoryAnswer,
  techAnswer,
};
