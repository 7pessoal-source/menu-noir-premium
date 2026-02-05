import express from 'express';
import prisma from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /products - Listar todos os produtos do restaurante
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { categoryId } = req.query;

    const where = {
      restaurantId: req.user.restaurantId,
      ...(categoryId && { categoryId: parseInt(categoryId) })
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

// POST /products - Criar novo produto
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, categoryId, imageUrl, active } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
    }

    // Verificar se a categoria pertence ao restaurante
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(categoryId),
        restaurantId: req.user.restaurantId
      }
    });

    if (!category) {
      return res.status(400).json({ error: 'Categoria inválida' });
    }

    const product = await prisma.product.create({
      data: {
        restaurantId: req.user.restaurantId,
        categoryId: parseInt(categoryId),
        name,
        description: description || null,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        active: active !== undefined ? active : true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// PUT /products/:id - Atualizar produto
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, imageUrl, active } = req.body;

    // Verificar se o produto pertence ao restaurante
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.user.restaurantId
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Se está mudando a categoria, verificar se ela pertence ao restaurante
    if (categoryId !== undefined) {
      const category = await prisma.category.findFirst({
        where: {
          id: parseInt(categoryId),
          restaurantId: req.user.restaurantId
        }
      });

      if (!category) {
        return res.status(400).json({ error: 'Categoria inválida' });
      }
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(categoryId !== undefined && { categoryId: parseInt(categoryId) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(active !== undefined && { active })
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// DELETE /products/:id - Deletar produto
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o produto pertence ao restaurante
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.user.restaurantId
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

export default router;
