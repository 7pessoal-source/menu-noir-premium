import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

const router = express.Router();

// Função para gerar slug a partir do nome
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { restaurantName, email, password } = req.body;

    // Validação básica
    if (!restaurantName || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Gerar slug único
    let slug = generateSlug(restaurantName);
    let slugExists = await prisma.restaurant.findUnique({ where: { slug } });
    let counter = 1;
    
    while (slugExists) {
      slug = `${generateSlug(restaurantName)}-${counter}`;
      slugExists = await prisma.restaurant.findUnique({ where: { slug } });
      counter++;
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar restaurante e usuário em uma transação
    const result = await prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          name: restaurantName,
          slug
        }
      });

      const user = await tx.user.create({
        data: {
          restaurantId: restaurant.id,
          email,
          passwordHash,
          role: 'admin'
        }
      });

      return { restaurant, user };
    });

    // Gerar JWT
    const token = jwt.sign(
      {
        userId: result.user.id,
        restaurantId: result.restaurant.id,
        email: result.user.email,
        role: result.user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role
      },
      restaurant: {
        id: result.restaurant.id,
        name: result.restaurant.name,
        slug: result.restaurant.slug
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: { restaurant: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Gerar JWT
    const token = jwt.sign(
      {
        userId: user.id,
        restaurantId: user.restaurantId,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      restaurant: {
        id: user.restaurant.id,
        name: user.restaurant.name,
        slug: user.restaurant.slug
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

export default router;
