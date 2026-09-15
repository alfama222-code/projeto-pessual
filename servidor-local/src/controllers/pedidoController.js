const prisma = require("../lib/prisma");

// Criar pedido
const criarPedido = async (req, res) => {
  try {
    const {
      clienteNome,
      clienteEndereco,
      formaPagamento,
      total,
      itens,
    } = req.body;

    if (
      !clienteNome ||
      !clienteEndereco ||
      !formaPagamento ||
      total === undefined ||
      !Array.isArray(itens) ||
      itens.length === 0
    ) {
      return res.status(400).json({
        erro: "Dados do pedido incompletos",
      });
    }

    const pedido = await prisma.pedido.create({
      data: {
        userId: req.user.id,
        clienteNome,
        clienteEndereco,
        formaPagamento,
        total: Number(total),

        itens: {
          create: itens.map((item) => ({
            produtoId: item.produtoId,
            nome: item.nome,
            preco: Number(item.preco),
            quantidade: Number(item.quantidade),
          })),
        },
      },
      include: {
        itens: true,
      },
    });

    return res.status(201).json(pedido);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);

    return res.status(500).json({
      erro: "Erro ao criar pedido",
      message: error.message,
    });
  }
};

// Listar pedidos do utilizador autenticado (com paginação)
const listarPedidos = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        where: { userId: req.user.id },
        include: { itens: true },
        orderBy: { criadoEm: "desc" },
        skip,
        take: limit,
      }),
      prisma.pedido.count({ where: { userId: req.user.id } }),
    ]);

    return res.status(200).json({
      data: pedidos,
      pagina: page,
      limite: limit,
      total,
      totalPaginas: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);

    return res.status(500).json({
      erro: "Erro ao listar pedidos",
      message: error.message,
    });
  }
};
// Obter pedido por ID
const obterPedido = async (req, res) => {
  try {
    const pedido = await prisma.pedido.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { itens: true },
    });

    if (!pedido) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    console.error("Erro ao obter pedido:", error);
    return res.status(500).json({ erro: "Erro ao obter pedido", message: error.message });
  }
};

// Atualizar status do pedido
const STATUS_VALIDOS = ["Pendente", "Em preparo", "Pronto", "Entregue", "Cancelado"];

const atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({
        erro: `Status inválido. Valores aceites: ${STATUS_VALIDOS.join(", ")}`,
      });
    }

    const pedido = await prisma.pedido.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!pedido) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: req.params.id },
      data: { status },
    });

    return res.status(200).json(pedidoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return res.status(500).json({ erro: "Erro ao atualizar status", message: error.message });
  }
};

// Apagar pedido
const apagarPedido = async (req, res) => {
  try {
    const pedido = await prisma.pedido.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!pedido) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    await prisma.pedido.delete({ where: { id: req.params.id } });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao apagar pedido:", error);
    return res.status(500).json({ erro: "Erro ao apagar pedido", message: error.message });
  }
};

module.exports = {
  criarPedido,
  listarPedidos,
  obterPedido,
  atualizarStatus,
  apagarPedido,
};