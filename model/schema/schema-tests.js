const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const testResultSchema = new Schema({
  type: {
        type: String,
        // enum: [testType.QA, testType.TESTTHEORY, testType.COMMON],
        // default: testType.COMMON
    },
    questions: {
        type: Array,
        required: [true, 'miss array of questions'],
    },
    
    rightAnswer: {
        type: String,
        required: [true, 'miss right Answer']
    }
}
    
  ,{ versionKey: false });

// contactSchema.plugin(mongoosePaginate);
const TheoryTest = model('theory-test', testResultSchema);
const TechnicalTest = model('technical-test', testResultSchema);

module.exports = {
  TheoryTest,
  TechnicalTest,
};
