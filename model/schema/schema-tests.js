const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const testResultSchema = new Schema({ versionKey: false });

// contactSchema.plugin(mongoosePaginate);
const TheoryTest = model('theory-test', testResultSchema);
const TechnicalTest = model('technical-test', testResultSchema);

module.exports = {
  TheoryTest,
  TechnicalTest,
};
