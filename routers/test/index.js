const express = require('express');
const router = express.Router();
const testController = require('../../controllers/tests');
const guard = require('../../helpers/guard');

router.get('/', (req, res, next) => {
  try {
    res.send();
  } catch (e) {
    next(e);
  }
});

router.get('/theory', guard, testController.getTechnicalRandomTest);
router.get('/tech', guard, testController.getTheoryRandomTest);

router.post('/result-theory', guard, testController.theoryAnswer);
router.post('/result-tech', guard, testController.techAnswer);

module.exports = router;
