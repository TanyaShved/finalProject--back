const User = require('./schema/schema-users');

const create = async ({ name, email, password, picture }) => {
  const user = new User({ name, email, password, picture });
  return await user.save();
};

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findById = async id => {
  return await User.findOne({ _id: id });
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = {
  findByEmail,
  create,
  findById,
  updateToken,
};
