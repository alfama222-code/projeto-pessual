const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.criarPedido = async (req, res) => {
  try {
    const { clienteNome, clienteEndereco, formaPagamento, total, itens } = req.body;

    const novoPedido = await prisma.pedido.create({
      data: {
        clienteNome,
        clienteEndereco,
        formaPagamento,
        total,
        itens: {
          create: itens.map(item => ({
            produtoId: item.produtoId,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade
          }))
        }
      },
      include: {
        itens: true
      }
    });

    res.status(201).json(novoPedido);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ erro: "Erro ao registrar o pedido" });
  }
};

exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: { itens: true },
      orderBy: { criadoEm: 'desc' }
    });

    // Calcula métricas
    const agora = new Date();
    
    // Hoje
    const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    
    // Início da semana (Domingo)
    const inicioSemana = new Date(agora);
    inicioSemana.setDate(agora.getDate() - agora.getDay());
    inicioSemana.setHours(0, 0, 0, 0);

    // Início do mês
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

    // Início do ano
    const inicioAno = new Date(agora.getFullYear(), 0, 1);

    const metrics = {
      hoje: { pedidos: 0, lucro: 0 },
      semana: { pedidos: 0, lucro: 0 },
      mes: { pedidos: 0, lucro: 0 },
      ano: { pedidos: 0, lucro: 0 },
      total: { pedidos: 0, lucro: 0 }
    };

    pedidos.forEach(p => {
      const dataPedido = new Date(p.criadoEm);
      const total = p.total;

      metrics.total.pedidos++;
      metrics.total.lucro += total;

      if (dataPedido >= inicioHoje) {
        metrics.hoje.pedidos++;
        metrics.hoje.lucro += total;
      }
      if (dataPedido >= inicioSemana) {
        metrics.semana.pedidos++;
        metrics.semana.lucro += total;
      }
      if (dataPedido >= inicioMes) {
        metrics.mes.pedidos++;
        metrics.mes.lucro += total;
      }
      if (dataPedido >= inicioAno) {
        metrics.ano.pedidos++;
        metrics.ano.lucro += total;
      }
    });

    res.status(200).json({ pedidos, metrics });
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({ erro: "Erro ao listar os pedidos" });
  }
};
