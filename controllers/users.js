const jwt = require('jsonwebtoken');
const queryString = require('query-string');
const axios = require('axios');
require('dotenv').config();
const Session = require('../model/schema/session-schema');
const SECRET_KEY = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const BASE_URL = process.env.BASE_URL;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY

const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');

const createSessionAndIssueTokens = async id => {
  const newSession = await Session.create({ id });
  const sessionId = newSession._id;
  const token = jwt.sign({ id, sessionId }, SECRET_KEY, {
    expiresIn: '20m',
  });
  const refreshToken = jwt.sign({ id, sessionId }, REFRESH_SECRET_KEY, {
    expiresIn: '30d',
  });
  await Users.updateToken(id, token);
  return { token, refreshToken, sessionId };
};

const reg = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      });
    }
    const newUser = await Users.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    if (!isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: 'Email or password is wrong',
      });
    }
    const id = user.id;
    const {
      token,
      refreshToken,
      sessionId,
    } = await createSessionAndIssueTokens(id);
    // const payload = { id };
    // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    // await Users.updateToken(id, token);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        refreshToken,
        sessionId,
        email,
        name: user.name,
        avatarURL: user.avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    const sessionId = req.session._id;
    await Session.findByIdAndDelete(sessionId);
    const userSessions = await Session.find({ id });
  if (userSessions.length > 3) {
    await Session.deleteMany({ id });
  }
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json();
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');
    if (authorizationHeader) {
      const activeSession = await Session.findById(req.body.sessionId);
      if (!activeSession) {
        return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'NOT_FOUND',
        message: 'User not found',
        });
      }

      // const reqRefreshToken = authorizationHeader.replace('Bearer ', '');

      let payload;
      // try {
      //   payload = jwt.verify(reqRefreshToken, REFRESH_SECRET_KEY);
      // } catch (err) {
      //   await Session.findByIdAndDelete(req.body.sessionId);
      //   return res.status(HttpCode.UNAUTHORIZED).json({
      //   status: 'error',
      //   code: HttpCode.UNAUTHORIZED,
      //   data: 'UNAUTHORIZED',
      //   message: 'Email or password is wrong',
      // });
      // }

      const user = await Users.findById(payload.id);
      const session = await Session.findById(payload.sessionId);
      if (!user) {
        return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'NOT_FOUND',
        message: 'User not found',
      });
      }
      if (!session) {
        return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'NOT_FOUND',
        message: 'Session not found',
        });
      }
      await Session.findByIdAndDelete(payload.sessionId);
      const userSessions = await Session.find({ id: user.id });
      if (userSessions.length > 3) {
        await Session.deleteMany({ id: user.id });
      }
      const id = user.id;
      const {
        token,
        refreshToken,
        sessionId,
      } = await createSessionAndIssueTokens(id);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          token,
          refreshToken,
          sessionId,
        },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'BAD_REQUEST',
      message: 'Token not provided',
    });
  } catch (e) {
    next(e);
  }
};

const userCurrent = async (req, res, next) => {
  try {
    const { id, email, name } = req.user;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: 'Not authorized',
      });
    }
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        name,
        email,
      },
    });
  } catch (e) {
    next(e);
  }
};

const googleAuth = async (_req, res, next) => {
  try {
    const stringifiedParams = queryString.stringify({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${BASE_URL}/auth/google-redirect`,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    return res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
    );
  } catch (e) {
    next(e);
  }
};

const googleRedirect = async (req, res, next) => {
  try {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);

    const code = urlParams.code;
    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/auth/google-redirect`,
        grant_type: 'authorization_code',
        code,
      },
    });
    const userData = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
      },
    });

    const { email, name, picture } = userData.data;
    const user = await Users.findByEmail(email);

    if (!user) {
    const newUser = await Users.createGoogle({ name, email, password: name, avatarURL: picture });
      const id = await newUser.id;
    // const payload = { id };
    // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    // await Users.updateToken(id, token);
    const {
        token,
        refreshToken,
        sessionId,
      } = await createSessionAndIssueTokens(id);

      return res.redirect(
      `${FRONTEND_URL}?token=${token}&refreshToken=${refreshToken}&sessionId=${sessionId}`
  );

    } else {
    const id = await user.id;
    // const payload = { id };
    // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    // await Users.updateToken(id, token);
      const {
        token,
        refreshToken,
        sessionId,
      } = await createSessionAndIssueTokens(id);
       
      return res.redirect(
      `${FRONTEND_URL}?token=${token}&refreshToken=${refreshToken}&sessionId=${sessionId}`
  );
      
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  reg,
  login,
  logout,
  refreshToken,
  userCurrent,
  googleAuth,
  googleRedirect,
};
