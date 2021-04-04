const express = require('express');
const router = express.Router();
const testController = require('../../../controllers/tests');
// const guard = require('../../../helpers/guard');

router.get('/', (req, res, next) => {
  try {
    res.send();
  } catch (e) {
    next(e);
  }
});

router.get('/tech', testController.getTechTest);
router.get('/theory', testController.getTheoryTest);

router.post('/result-theory', testController.theoryAnswer);
router.post('/result-tech', testController.techAnswer);

module.exports = router;
