const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const validate = require('../middlewares/validateMiddleware');
const { registerSchema, loginSchema } = require('../schemas/authSchema');

// Rota para registrar um novo usuário
router.post('/registro', validate(registerSchema), authController.register);

// Rota para fazer login
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
