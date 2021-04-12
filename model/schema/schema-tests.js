const { Schema, model } = require('mongoose');

const testResultSchema = new Schema(
  {
    question: {
      type: String,
      unique: true,
    },
    questionId: {
      type: String,
      unique: true,
    },
    answers: {
      type: Array,
      required: true,
    },
    rightAnswer: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

// contactSchema.plugin(mongoosePaginate);
const TheoryTest = model('theory-test', testResultSchema);
const TechnicalTest = model('technical-test', testResultSchema);

module.exports = {
  TheoryTest,
  TechnicalTest,
};
