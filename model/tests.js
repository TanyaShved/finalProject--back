const { TheoryTest, TechnicalTest } = require('./schema/schema-tests');

const getTheoryTest = async () => {
  const results = await TheoryTest.find({});
  console.log(results);
  return results;
};

const getTechnicalTest = async () => {
  const results = await TechnicalTest.find({});
  console.log(results);
  return results;
};

module.exports = {
  getTheoryTest,
  getTechnicalTest,
};
