const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users');
const validate = require('./validation');
const guard = require('../../helpers/guard');

router
    .post('/signup', validate.regUser, userController.reg)
    .post('/signin', validate.loginUser, userController.login)
    .post('/logout', guard, userController.logout)
    .post('/auth/refresh', userController.refreshToken);


router.get("/google", userController.googleAuth);
router.get("/google-redirect", userController.googleRedirect);

router.get('/userinfo', guard, userController.userCurrent);

module.exports = router;
