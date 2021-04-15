const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const Users = require('../model/users');
const Session = require('../model/schema/session-schema');

require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      const session = await Session.findById(payload.sessionId);

      if (!user) {
        return done(new Error('User not found'));
      }

      if (!user.token) {
        return done(null, false);
      }
      return done(null, { user, session });
    } catch (e) {
      done(e);
    }
  }),
);
