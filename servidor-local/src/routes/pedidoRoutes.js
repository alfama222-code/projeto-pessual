const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validar, criarPedidoSchema, atualizarStatusSchema } = require('../lib/validators');

// Criação de um novo pedido
router.post('/', authMiddleware, validar(criarPedidoSchema), pedidoController.criarPedido);

// Listagem de pedidos (com paginação: ?page=1&limit=10)
router.get('/', authMiddleware, pedidoController.listarPedidos);

// Buscar pedido por ID
router.get('/:id', authMiddleware, pedidoController.obterPedido);

// Atualizar status do pedido
router.patch('/:id/status', authMiddleware, validar(atualizarStatusSchema), pedidoController.atualizarStatus);

// Apagar pedido
router.delete('/:id', authMiddleware, pedidoController.apagarPedido);

module.exports = router;
