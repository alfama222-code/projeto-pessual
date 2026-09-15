const { z } = require("zod");

// ── Auth ──────────────────────────────────────────────────────────────────────
const registarSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

// ── Pedido ────────────────────────────────────────────────────────────────────
const itemPedidoSchema = z.object({
  produtoId: z.string().min(1, "produtoId é obrigatório"),
  nome: z.string().min(1, "nome do item é obrigatório"),
  preco: z.number().positive("preco deve ser positivo"),
  quantidade: z.number().int().positive("quantidade deve ser um inteiro positivo"),
});

const criarPedidoSchema = z.object({
  clienteNome: z.string().min(1, "Nome do cliente é obrigatório"),
  clienteEndereco: z.string().min(1, "Endereço é obrigatório"),
  formaPagamento: z.enum(["Dinheiro", "Cartão", "MB Way", "Multibanco", "Transferência"], {
    errorMap: () => ({ message: "Forma de pagamento inválida" }),
  }),
  total: z.number().positive("Total deve ser positivo"),
  itens: z.array(itemPedidoSchema).min(1, "O pedido deve ter pelo menos um item"),
});

const atualizarStatusSchema = z.object({
  status: z.enum(["Pendente", "Em preparo", "Pronto", "Entregue", "Cancelado"], {
    errorMap: () => ({ message: "Status inválido" }),
  }),
});

// ── Middleware de validação ────────────────────────────────────────────────────
/**
 * Middleware factory que valida o req.body com um schema Zod.
 * Em caso de erro, retorna 400 com lista de mensagens.
 */
const validar = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);

  if (!resultado.success) {
    const erros = resultado.error.errors.map((e) => ({
      campo: e.path.join("."),
      mensagem: e.message,
    }));

    return res.status(400).json({ erro: "Dados inválidos", detalhes: erros });
  }

  req.body = resultado.data; // dados já validados e limpos
  next();
};

module.exports = {
  registarSchema,
  loginSchema,
  criarPedidoSchema,
  atualizarStatusSchema,
  validar,
};
