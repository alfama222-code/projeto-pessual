require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importando rotas
const authRoutes = require('./src/routes/authRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Definindo as rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Servidor Local funcionando perfeitamente!' });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
