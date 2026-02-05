# Menu Noir Premium - Sistema Multi-Restaurante

Sistema SaaS simples para gerenciamento de cardápios digitais. Múltiplos restaurantes podem se cadastrar, fazer login e gerenciar seus próprios cardápios de forma isolada.

## 🎯 Características

- ✅ **Multi-restaurante**: Um único sistema, múltiplos restaurantes
- ✅ **Autenticação simples**: Email + senha (sem verificação)
- ✅ **Isolamento de dados**: Cada restaurante vê apenas seus dados
- ✅ **CRUD completo**: Categorias e produtos
- ✅ **Cardápio público**: Cada restaurante tem seu link público `/menu/:slug`
- ✅ **Upload de imagens**: Integração com Cloudinary
- ✅ **Backend próprio**: Node.js + Express + Prisma + PostgreSQL

## 🏗️ Arquitetura

### Backend
- **Node.js** + **Express** (REST API)
- **Prisma ORM** (gerenciamento de banco)
- **PostgreSQL** (banco de dados)
- **JWT** (autenticação)
- **bcrypt** (hash de senhas)

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS 4** + **shadcn/ui**
- **Cloudinary** (upload de imagens)

### Banco de Dados

```
restaurants
├── id
├── name
├── slug (único)
└── timestamps

users
├── id
├── restaurant_id (FK)
├── email (único)
├── password_hash
├── role
└── timestamps

categories
├── id
├── restaurant_id (FK)
├── name
├── order
├── active
└── timestamps

products
├── id
├── restaurant_id (FK)
├── category_id (FK)
├── name
├── description
├── price
├── image_url
├── active
└── timestamps
```

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- pnpm (ou npm/yarn)

### Instalação Rápida

```bash
# 1. Clonar repositório
git clone https://github.com/7pessoal-source/menu-noir-premium.git
cd menu-noir-premium

# 2. Configurar .env
cp .env.example .env
# Edite .env com suas credenciais PostgreSQL e Cloudinary

# 3. Instalar dependências do backend
cd server
pnpm install
pnpm rebuild

# 4. Gerar Prisma Client e criar banco
pnpm exec prisma generate --schema=../prisma/schema.prisma
pnpm exec prisma migrate dev --schema=../prisma/schema.prisma --name init

# 5. Instalar dependências do frontend
cd ..
pnpm install

# 6. Rodar backend (terminal 1)
cd server
pnpm dev

# 7. Rodar frontend (terminal 2)
cd ..
pnpm dev
```

Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📋 API Endpoints

### Autenticação (Público)

**POST /auth/register**
```json
{
  "restaurantName": "Pizzaria do Zé",
  "email": "contato@pizzariadoze.com",
  "password": "senha123"
}
```

**POST /auth/login**
```json
{
  "email": "contato@pizzariadoze.com",
  "password": "senha123"
}
```

### Categorias (Protegido - requer token JWT)

- **GET /categories** - Listar categorias
- **POST /categories** - Criar categoria
- **PUT /categories/:id** - Atualizar categoria
- **DELETE /categories/:id** - Deletar categoria

### Produtos (Protegido - requer token JWT)

- **GET /products** - Listar produtos
- **GET /products?categoryId=1** - Listar produtos por categoria
- **POST /products** - Criar produto
- **PUT /products/:id** - Atualizar produto
- **DELETE /products/:id** - Deletar produto

### Menu Público

- **GET /menu/:slug** - Obter cardápio público do restaurante

Exemplo: `GET /menu/pizzaria-do-ze`

## 🔒 Segurança

### Isolamento de Dados
- Middleware `authMiddleware` valida JWT em todas rotas protegidas
- JWT contém `restaurantId` do usuário
- Todas queries filtram por `req.user.restaurantId`
- Impossível acessar dados de outro restaurante

### Autenticação
- Senhas com hash bcrypt (10 rounds)
- JWT expira em 7 dias
- Formato: `Authorization: Bearer <token>`

## 📁 Estrutura do Projeto

```
menu-noir-premium/
├── server/                 # Backend
│   ├── routes/            # Rotas da API
│   │   ├── auth.js        # Registro e login
│   │   ├── categories.js  # CRUD categorias
│   │   ├── products.js    # CRUD produtos
│   │   └── menu.js        # Cardápio público
│   ├── middleware/        # Middlewares
│   │   └── auth.js        # Validação JWT
│   ├── config/            # Configurações
│   │   └── database.js    # Prisma Client
│   ├── server.js          # Servidor Express
│   └── package.json
├── prisma/
│   └── schema.prisma      # Schema do banco
├── client/                # Frontend
│   └── src/
│       ├── pages/         # Páginas React
│       ├── components/    # Componentes
│       └── lib/           # Utilitários
├── .env                   # Variáveis de ambiente
├── SETUP.md              # Guia detalhado de setup
└── README.md             # Este arquivo
```

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

**Criar categoria (com token):**
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

### Opções Recomendadas

**Backend + Banco:**
- Railway (mais fácil)
- Render
- Fly.io

**Frontend:**
- Vercel
- Netlify
- Cloudflare Pages

### Configuração PostgreSQL

**Opções gratuitas:**
- Neon (PostgreSQL serverless)
- Supabase
- Railway

## 📖 Documentação Completa

Para instruções detalhadas de setup, API e deploy, veja [SETUP.md](./SETUP.md)

## ✅ Checklist de Implementação

- ✅ Schema Prisma limpo
- ✅ Middleware de autenticação simples
- ✅ Sem tRPC
- ✅ Sem SQLite
- ✅ Todas queries usam `restaurant_id`
- ✅ Login funciona sem verificação de email
- ✅ Isolamento de dados garantido
- ✅ Rotas REST simples
- ✅ JWT + bcrypt

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

---

**Desenvolvido com foco em simplicidade e funcionalidade** 🚀
