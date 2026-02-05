import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  try {
    // Pegar token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const token = parts[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adicionar informações do usuário ao request
    req.user = {
      userId: decoded.userId,
      restaurantId: decoded.restaurantId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Erro na autenticação' });
  }
}
