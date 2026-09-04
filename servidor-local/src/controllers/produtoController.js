const prisma = require('../config/db');

const listarProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    return res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor ao buscar produtos.' });
  }
};

module.exports = {
  listarProdutos
};
