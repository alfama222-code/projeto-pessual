const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");

const registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        erro: "A senha deve ter pelo menos 6 caracteres.",
      });
    }

    const utilizadorExistente = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (utilizadorExistente) {
      return res.status(409).json({
        erro: "Este e-mail já está registado.",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const utilizador = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
    });

    return res.status(201).json({
      mensagem: "Utilizador registado com sucesso.",
      utilizador: {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
      },
    });
  } catch (error) {
    console.error("ERRO COMPLETO NO REGISTRO:", error);

    return res.status(500).json({
      erro: "Erro interno ao efetuar o registro.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "E-mail e senha são obrigatórios.",
      });
    }

    const utilizador = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!utilizador) {
      return res.status(401).json({
        erro: "E-mail ou senha incorretos.",
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      utilizador.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "E-mail ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      {
        id: utilizador.id,
        email: utilizador.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      mensagem: "Login efetuado com sucesso.",
      token,
      utilizador: {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
      },
    });
  } catch (error) {
    console.error("ERRO COMPLETO NO LOGIN:", error);

    return res.status(500).json({
      erro: "Erro interno ao efetuar login.",
    });
  }
};

module.exports = {
  registrar,
  login,
};