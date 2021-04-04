const { TheoryTest, TechnicalTest } = require('./schema/schema-tests');

const getTheoryTest = async () => {
  const results = await TheoryTest.find({});

  return results;
};

const getTechnicalTest = async () => {
  const results = await TechnicalTest.find({});
  return results;
};

const getQtyAnsw = (arrAnsw, arrRight) => {
  const result = arrAnsw.filter(item =>
    arrRight.some(
      ({ _doc }) =>
        item.questionId === _doc.questionId && item.answer === _doc.rightAnswer,
    ),
  );

  return result.length;
};

module.exports = {
  getTheoryTest,
  getTechnicalTest,
  getQtyAnsw,
};
