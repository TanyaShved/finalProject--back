const uiavatars = require("ui-avatars");
const User = require('./schema/schema-users');

const create = async ({ name, email, password }) => {
  const avatarURL = uiavatars.generateAvatar({
    uppercase: true,
    fontsize: 0.5,
    bold: true,
    length: 1,
    rounded: true,
    size: 200,
    background: "ffffff",
    name: name,
  });
  const user = new User({ name, email, password, avatarURL });
  return await user.save();
};

const createGoogle = async ({ name, email, password, avatarURL }) => {
  const user = new User({ name, email, password, avatarURL });
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
  createGoogle,
  findById,
  updateToken,
};
