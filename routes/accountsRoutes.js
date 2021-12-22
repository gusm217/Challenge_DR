const express = require('express');
const accountsController = require('../controllers/accounts');
const { createValidation, depositsValidation, transfersValidation } = require('../validations/schemasValidation');

const router = express.Router();

router.post('/', createValidation, accountsController.createAccount);
router.put('/transfers', transfersValidation, accountsController.transferBalance);
router.put('/deposits', depositsValidation, accountsController.deposit);
router.get('/', accountsController.getAllAccounts);

module.exports = router;