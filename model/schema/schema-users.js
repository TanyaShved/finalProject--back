const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 8;

const userSchema = new Schema(
  {
   name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: [true, 'Set email for user'],
      unique: true,
      validate(value) {
            const re = /\S+@\S+\.\S+/
            return re.test(String(value).toLowerCase())
      }
    },
    password: {
      type: String,
      require: [true, 'Password required'],
    },

    token: {
      type: String,
      default: null,
    },
     picture: {
    type: String,
    } 
  },
  { versionKey: false, timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
