const { TheoryTest, TechnicalTest } = require('./schema/schema-tests');

const getTheoryTest = async () => {
  const results = await TheoryTest.find({});
  return results;
};

const getTechnicalTest = async () => {
  const results = await TechnicalTest.find({});
  return results;
};

module.exports = {
  getTheoryTest,
  getTechnicalTest,
};
