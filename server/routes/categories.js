import express from 'express';
import prisma from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /categories - Listar todas as categorias do restaurante
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { restaurantId: req.user.restaurantId },
      orderBy: { order: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro ao listar categorias' });
  }
});

// POST /categories - Criar nova categoria
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, order, active } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
    }

    const category = await prisma.category.create({
      data: {
        restaurantId: req.user.restaurantId,
        name,
        order: order || 0,
        active: active !== undefined ? active : true
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

// PUT /categories/:id - Atualizar categoria
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order, active } = req.body;

    // Verificar se a categoria pertence ao restaurante
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.user.restaurantId
      }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active })
      }
    });

    res.json(category);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

// DELETE /categories/:id - Deletar categoria
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a categoria pertence ao restaurante
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.user.restaurantId
      }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
});

export default router;
