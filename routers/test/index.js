const express = require('express');
const router = express.Router();
const testController = require('../../controllers/tests');
// const guard = require('../../helpers/guard');

router.get('/theory', testController.getTechnicalRandomTest);
router.get('/tech', testController.getTheoryRandomTest);

router.post('/result-theory', testController.theoryAnswer);
router.post('/result-tech', testController.techAnswer);

module.exports = router;
