import express from 'express';
import prisma from '../config/database.js';

const router = express.Router();

// GET /menu/:slug - Obter cardápio público do restaurante
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Buscar restaurante
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurante não encontrado' });
    }

    // Buscar categorias ativas
    const categories = await prisma.category.findMany({
      where: {
        restaurantId: restaurant.id,
        active: true
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        order: true
      }
    });

    // Buscar produtos ativos
    const products = await prisma.product.findMany({
      where: {
        restaurantId: restaurant.id,
        active: true,
        category: {
          active: true
        }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug
      },
      categories,
      products
    });
  } catch (error) {
    console.error('Erro ao buscar cardápio:', error);
    res.status(500).json({ error: 'Erro ao buscar cardápio' });
  }
});

export default router;
