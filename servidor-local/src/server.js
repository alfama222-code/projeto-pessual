require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// ===============================
// CORS dinâmico (#15)
// ===============================
const ORIGENS_PERMITIDAS = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sem origin (ex: curl, Postman)
      if (!origin || ORIGENS_PERMITIDAS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado para a origem: ${origin}`));
      }
    },
    credentials: true,
  })
);

// ===============================
// Logging estruturado — morgan (#14)
// ===============================
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ===============================
// Rate Limiting nas rotas de auth (#12)
// ===============================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,                   // máximo 20 tentativas por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Demasiadas tentativas. Tente novamente em 15 minutos." },
});

// ===============================
// Middlewares
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Rota principal
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "Servidor Local API funcionando!",
  });
});

// ===============================
// Teste da API
// ===============================
app.get("/api", (req, res) => {
  res.json({
    message: "API funcionando corretamente",
  });
});

// ===============================
// Rotas
// ===============================
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/pedidos", pedidoRoutes);

// ===============================
// Tratamento de erros
// ===============================
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);

  res.status(500).json({
    erro: "Erro interno do servidor",
    message: err.message,
  });
});

// ===============================
// Iniciar servidor
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🌐 CORS permitido para: ${ORIGENS_PERMITIDAS.join(", ")}`);
});