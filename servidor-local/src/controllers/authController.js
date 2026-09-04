const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// O segredo do JWT deve vir do .env na vida real
const JWT_SECRET = process.env.JWT_SECRET || 'meu_segredo_super_seguro_123';

const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se o usuário já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Este e-mail já está cadastrado' });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Criar o usuário no banco
    const novoUsuario = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada
      }
    });

    // Retornar os dados do usuário (sem a senha)
    return res.status(201).json({
      mensagem: 'Usuário registrado com sucesso',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar o usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
    }

    // Verificar a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '1d' } // O token expira em 1 dia
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

module.exports = {
  register,
  login
};
