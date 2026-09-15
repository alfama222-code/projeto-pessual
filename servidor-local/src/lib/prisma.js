const { PrismaClient } = require("@prisma/client");

// Singleton do PrismaClient — partilhado por todos os módulos.
// Evita criação de múltiplas conexões ao banco de dados.
const prisma = new PrismaClient();

module.exports = prisma;
