const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users');
const validate = require('./validation');
const guard = require('../../helpers/guard');

router.post('/signup', validate.regUser, userController.reg);
router.post('/signin', validate.loginUser, userController.login);
router.post('/logout', guard, userController.logout);

router.get("/google", userController.googleAuth);

router.get("/google-redirect", userController.googleRedirect);

router.get('/userinfo', guard, userController.userCurrent);

module.exports = router;
