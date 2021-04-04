const express = require('express');
const router = express.Router();
const testController = require('../../../controllers/tests');
// const guard = require('../../../helpers/guard');

router.get('/tech', testController.getTechTest);
router.get('/theory', testController.getTheoryTest);

module.exports = router;
