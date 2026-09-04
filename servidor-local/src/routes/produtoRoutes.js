const express = require('express');
const router = express.Router();

const produtoController = require('../controllers/produtoController');

// Rota para listar todos os produtos
router.get('/', produtoController.listarProdutos);

module.exports = router;
