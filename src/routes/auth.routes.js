const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { registerRules, loginRules, adminLoginRules } = require('../validators/auth.validator');
const validate = require('../middlewares/validate');

const router = Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/admin/login', adminLoginRules, validate, authController.adminLogin);

module.exports = router;
