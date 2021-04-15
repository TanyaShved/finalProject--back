const { Schema, model } = require('mongoose');

const sessionSchema = new Schema({
  id: {
    type: String,
  },
});

const SessionModel = model('session', sessionSchema);

module.exports = SessionModel;