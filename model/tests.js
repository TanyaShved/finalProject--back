const { TheoryTest, TechnicalTest } = require('./schema/schema-tests');

const getTheoryTest = async () => {
  const results = await TheoryTest.find({});
  const randomArray = []
  while (randomArray.length < 12) {
    const randomIndex = Math.floor(Math.random() * results.length);
    const dontHasItem = !randomArray.find(item => item._id === results[randomIndex]._id)
    dontHasItem && randomArray.push(results[randomIndex])
  }
  return randomArray;
};

const getTechnicalTest = async () => {
  const results = await TechnicalTest.find({});
  const randomArray = []
  while (randomArray.length < 12) {
    const randomIndex = Math.floor(Math.random() * results.length);
    const dontHasItem = !randomArray.find(item => item._id === results[randomIndex]._id)
    dontHasItem && randomArray.push(results[randomIndex])
  }
  return randomArray;
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
