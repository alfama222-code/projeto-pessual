const express = require("express");

const router = express.Router();

const { registrar, login } = require("../controllers/authController");
const { validar, registarSchema, loginSchema } = require("../lib/validators");

router.post("/registro", validar(registarSchema), registrar);
router.post("/login", validar(loginSchema), login);

module.exports = router;