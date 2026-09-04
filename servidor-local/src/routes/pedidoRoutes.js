const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Criação de um novo pedido
router.post('/', pedidoController.criarPedido);

// Listagem de pedidos e métricas
router.get('/', pedidoController.listarPedidos);

module.exports = router;
