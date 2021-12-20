const express = require('express');
const accountsController = require('../controllers/accounts');
const { createValidation } = require('../middlewares/createValidation');
const { transfersValidation } = require('../middlewares/transfersValidation');
const { depositsValidation } = require('../middlewares/depositsValidation');

const router = express.Router();

router.post('/', createValidation, accountsController.createAccount);
router.put('/transfers', transfersValidation, accountsController.transferBalance);
router.put('/deposits', depositsValidation, accountsController.deposit);

module.exports = router;