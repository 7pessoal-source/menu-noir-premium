# Menu Noir Premium - Setup Guide

Sistema multi-restaurante simples com backend Node.js + Express + Prisma + PostgreSQL e frontend React + Vite.

## 🎯 Arquitetura

### Backend
- **Node.js** + **Express** (servidor REST API)
- **Prisma ORM** (gerenciamento de banco de dados)
- **PostgreSQL** (banco de dados)
- **JWT** (autenticação simples)
- **bcrypt** (hash de senhas)

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Cloudinary** (upload de imagens)

### Isolamento de Dados
- Todas as tabelas possuem `restaurant_id`
- JWT contém `restaurant_id` do usuário
- Middleware garante que cada restaurante vê apenas seus dados

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- pnpm (ou npm/yarn)

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/7pessoal-source/menu-noir-premium.git
cd menu-noir-premium
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Frontend - Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=seu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset

# Backend - Database
DATABASE_URL="postgresql://user:password@localhost:5432/menu_noir?schema=public"

# Backend - JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"

# Backend - Server
PORT=3001
NODE_ENV=development
```

### 3. Instalar dependências

**Backend:**
```bash
cd server
pnpm install
```

**Frontend:**
```bash
cd ..
pnpm install
```

### 4. Configurar banco de dados

```bash
cd server
pnpm prisma:generate
pnpm prisma:migrate
```

Isso irá:
- Gerar o Prisma Client
- Criar as tabelas no PostgreSQL

### 5. Rodar o projeto

**Terminal 1 - Backend:**
```bash
cd server
pnpm dev
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

O backend estará rodando em `http://localhost:3001` e o frontend em `http://localhost:5173`.

## 📊 Estrutura do Banco de Dados

### Tabelas

**restaurants**
- `id` (PK)
- `name`
- `slug` (único)
- `created_at`
- `updated_at`

**users**
- `id` (PK)
- `restaurant_id` (FK)
- `email` (único)
- `password_hash`
- `role` (admin/user)
- `created_at`
- `updated_at`

**categories**
- `id` (PK)
- `restaurant_id` (FK)
- `name`
- `order`
- `active`
- `created_at`
- `updated_at`

**products**
- `id` (PK)
- `restaurant_id` (FK)
- `category_id` (FK)
- `name`
- `description`
- `price`
- `image_url`
- `active`
- `created_at`
- `updated_at`

## 🔌 API Endpoints

### Autenticação (Público)

**POST /auth/register**
```json
{
  "restaurantName": "Pizzaria do Zé",
  "email": "contato@pizzariadoze.com",
  "password": "senha123"
}
```
Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "contato@pizzariadoze.com",
    "role": "admin"
  },
  "restaurant": {
    "id": 1,
    "name": "Pizzaria do Zé",
    "slug": "pizzaria-do-ze"
  }
}
```

**POST /auth/login**
```json
{
  "email": "contato@pizzariadoze.com",
  "password": "senha123"
}
```

### Categorias (Protegido)

**GET /categories**
- Headers: `Authorization: Bearer <token>`
- Retorna todas as categorias do restaurante

**POST /categories**
```json
{
  "name": "Pizzas",
  "order": 1,
  "active": true
}
```

**PUT /categories/:id**
```json
{
  "name": "Pizzas Especiais",
  "order": 2,
  "active": true
}
```

**DELETE /categories/:id**

### Produtos (Protegido)

**GET /products**
- Headers: `Authorization: Bearer <token>`
- Query params: `?categoryId=1` (opcional)
- Retorna todos os produtos do restaurante

**POST /products**
```json
{
  "name": "Pizza Margherita",
  "description": "Molho de tomate, mussarela e manjericão",
  "price": 35.90,
  "categoryId": 1,
  "imageUrl": "https://res.cloudinary.com/...",
  "active": true
}
```

**PUT /products/:id**
```json
{
  "name": "Pizza Margherita Especial",
  "price": 39.90
}
```

**DELETE /products/:id**

### Menu Público

**GET /menu/:slug**
- Exemplo: `GET /menu/pizzaria-do-ze`
- Retorna cardápio público com categorias e produtos ativos

Resposta:
```json
{
  "restaurant": {
    "id": 1,
    "name": "Pizzaria do Zé",
    "slug": "pizzaria-do-ze"
  },
  "categories": [
    { "id": 1, "name": "Pizzas", "order": 1 }
  ],
  "products": [
    {
      "id": 1,
      "name": "Pizza Margherita",
      "description": "Molho de tomate, mussarela e manjericão",
      "price": 35.90,
      "imageUrl": "https://...",
      "category": { "id": 1, "name": "Pizzas" }
    }
  ]
}
```

## 🔒 Segurança

### Autenticação JWT
- Token expira em 7 dias
- Contém: `userId`, `restaurantId`, `email`, `role`
- Formato: `Authorization: Bearer <token>`

### Isolamento de Dados
- Middleware `authMiddleware` valida JWT
- Todas as queries filtram por `req.user.restaurantId`
- Impossível acessar dados de outro restaurante

### Senhas
- Hash com bcrypt (10 rounds)
- Nunca armazenadas em texto plano

## 🧪 Testando a API

### Usando curl

**Registrar:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantName": "Pizzaria do Zé",
    "email": "contato@pizzariadoze.com",
    "password": "senha123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contato@pizzariadoze.com",
    "password": "senha123"
  }'
```

**Criar categoria:**
```bash
curl -X POST http://localhost:3001/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Pizzas",
    "order": 1
  }'
```

## 🐳 Deploy

### Opções de hospedagem

**Backend:**
- Railway
- Render
- Fly.io
- DigitalOcean App Platform
- AWS EC2

**Banco de dados:**
- Neon (PostgreSQL serverless)
- Supabase
- Railway
- Render

**Frontend:**
- Vercel
- Netlify
- Cloudflare Pages

### Variáveis de ambiente em produção

Não esqueça de configurar:
- `DATABASE_URL` (PostgreSQL de produção)
- `JWT_SECRET` (chave forte e única)
- `NODE_ENV=production`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

## 📝 Checklist de Implementação

✅ Schema Prisma limpo  
✅ Middleware de autenticação simples  
✅ Sem tRPC  
✅ Sem SQLite  
✅ Todas queries usam `restaurant_id`  
✅ Login funciona sem verificação de email  
✅ Isolamento de dados garantido  
✅ Rotas REST simples  
✅ JWT com bcrypt  

## 🛠️ Comandos Úteis

```bash
# Backend
cd server
pnpm dev                  # Rodar em desenvolvimento
pnpm start                # Rodar em produção
pnpm prisma:generate      # Gerar Prisma Client
pnpm prisma:migrate       # Aplicar migrations

# Frontend
pnpm dev                  # Rodar em desenvolvimento
pnpm build                # Build para produção
pnpm preview              # Preview do build

# Prisma Studio (GUI do banco)
cd server
npx prisma studio
```

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

---

**Desenvolvido com simplicidade e foco em funcionalidade** 🚀
