# Menu Noir Admin - Sistema de Cardápio Digital SaaS

Um painel administrativo profissional e escalável para gerenciar cardápios digitais de restaurantes. Sistema completo com autenticação robusta, isolamento de dados, CRUD completo e cardápio público integrado.

## 🎯 Funcionalidades Principais

### Painel Administrativo
- ✅ **Autenticação Segura**: Email/senha com bcrypt + JWT
- ✅ **Dashboard**: Estatísticas em tempo real (total de produtos, categorias, último item editado)
- ✅ **Gerenciamento de Categorias**: CRUD completo com ordem de exibição
- ✅ **Gerenciamento de Produtos**: CRUD com imagem, descrição, preço e status ativo/inativo
- ✅ **Gerenciamento de Extras**: CRUD com tipos checkbox (múltiplos) e radio (único)
- ✅ **Configurações do Restaurante**: Nome, logo, WhatsApp, horário de funcionamento e status
- ✅ **Layout Sidebar**: Navegação intuitiva e responsiva

### Cardápio Público
- ✅ **Categorias em Carrossel**: Navegação horizontal com scroll suave
- ✅ **Imagens Otimizadas**: Redimensionadas para melhor performance
- ✅ **Seleção de Extras**: Suporte a checkbox (múltiplos) e radio (único)
- ✅ **Carrinho Funcional**: Adicionar, remover, ajustar quantidade
- ✅ **Integração WhatsApp**: Geração automática de mensagem com detalhes do pedido
- ✅ **Status do Restaurante**: Alerta quando fechado
- ✅ **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 🏗️ Arquitetura

### Stack Tecnológico
- **Frontend**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend**: Express 4 + tRPC 11 + Drizzle ORM
- **Banco de Dados**: MySQL/TiDB
- **Autenticação**: JWT + bcrypt
- **Build**: Vite + esbuild

### Estrutura de Dados

```
restaurants (id, nome, logo, whatsapp, status, hoursOfOperation)
  ├── categories (id, restaurantId, nome, displayOrder, active)
  ├── products (id, restaurantId, categoryId, nome, descrição, basePrice, image, active)
  └── extras (id, restaurantId, categoryId, nome, price, type, active)
users (id, email, password, name, restaurantId, role)
```

### Segurança

- **Isolamento Multi-Restaurante**: Cada query filtra por `restaurantId` da sessão
- **Autenticação JWT**: Tokens seguros com expiração
- **Password Hashing**: bcrypt com salt automático
- **Validação de Entrada**: Zod em todas as rotas
- **Proteção de Rotas**: Middleware `protectedProcedure` em operações sensíveis

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- pnpm 10+
- MySQL 8+ ou TiDB

### Instalação

```bash
# Clonar repositório
git clone https://github.com/7pessoal-source/menu-noir.git
cd menu-noir-admin

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Gerar e aplicar migrations
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Rodar em desenvolvimento
pnpm dev

# Rodar testes
pnpm test

# Build para produção
pnpm build
pnpm start
```

### Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=mysql://user:password@localhost:3306/menu_noir

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# Servidor
NODE_ENV=development
PORT=3000
```

## 📋 Fluxo de Uso

### Para o Restaurante (Admin)

1. **Cadastro**: Criar conta com email e senha
2. **Configurações**: Preencher dados do restaurante (nome, logo, WhatsApp, horário)
3. **Categorias**: Criar categorias (Lanches, Bebidas, Sobremesas, etc)
4. **Produtos**: Adicionar produtos com preço, descrição e imagem
5. **Extras**: Criar adicionais (Bacon, Queijo, Molhos, etc)
6. **Publicar**: Cardápio fica disponível em `/menu`

### Para o Cliente (Public)

1. **Acessar**: Ir para `/menu`
2. **Navegar**: Filtrar por categoria (carrossel horizontal)
3. **Selecionar**: Escolher produto e extras
4. **Carrinho**: Adicionar itens, ajustar quantidade
5. **Pedido**: Clicar em "Enviar Pedido" → WhatsApp com detalhes

## 🧪 Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar em modo watch
pnpm test --watch

# Gerar coverage
pnpm test --coverage
```

## 📊 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout

### Restaurante (Protegido)
- `GET /trpc/restaurant.get` - Obter dados
- `PATCH /trpc/restaurant.update` - Atualizar dados

### Categorias (Protegido)
- `GET /trpc/categories.list` - Listar todas
- `GET /trpc/categories.listActive` - Listar ativas (público)
- `POST /trpc/categories.create` - Criar
- `PATCH /trpc/categories.update` - Atualizar
- `DELETE /trpc/categories.delete` - Deletar
- `POST /trpc/categories.toggle` - Ativar/desativar

### Produtos (Protegido)
- `GET /trpc/products.list` - Listar todas
- `GET /trpc/products.listActive` - Listar ativas (público)
- `GET /trpc/products.listByCategory` - Listar por categoria (público)
- `POST /trpc/products.create` - Criar
- `PATCH /trpc/products.update` - Atualizar
- `DELETE /trpc/products.delete` - Deletar
- `POST /trpc/products.toggle` - Ativar/desativar

### Extras (Protegido)
- `GET /trpc/extras.list` - Listar todas
- `GET /trpc/extras.listByCategory` - Listar por categoria (público)
- `POST /trpc/extras.create` - Criar
- `PATCH /trpc/extras.update` - Atualizar
- `DELETE /trpc/extras.delete` - Deletar
- `POST /trpc/extras.toggle` - Ativar/desativar

### Dashboard (Protegido)
- `GET /trpc/dashboard.stats` - Obter estatísticas

## 🔧 Desenvolvimento

### Adicionar Nova Funcionalidade

1. **Schema**: Atualizar `drizzle/schema.ts`
2. **Migration**: Rodar `pnpm drizzle-kit generate`
3. **Database**: Adicionar helpers em `server/db.ts`
4. **API**: Criar procedures em `server/routers.ts`
5. **Frontend**: Criar componentes em `client/src/pages/`
6. **Testes**: Escrever testes em `server/*.test.ts`

### Estrutura de Pastas

```
menu-noir-admin/
├── client/
│   ├── src/
│   │   ├── pages/          # Páginas (Admin, Menu, etc)
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── lib/            # Utilitários (tRPC client, etc)
│   │   ├── _core/          # Contextos, hooks
│   │   └── App.tsx         # Router principal
│   └── public/             # Assets estáticos
├── server/
│   ├── routers.ts          # Procedures tRPC
│   ├── db.ts               # Query helpers
│   ├── auth.ts             # Autenticação (bcrypt, JWT)
│   └── _core/              # Framework (context, oauth, etc)
├── drizzle/
│   ├── schema.ts           # Definição de tabelas
│   └── migrations/         # SQL migrations
├── shared/                 # Código compartilhado
└── package.json
```

## 📝 Melhorias Futuras

- [ ] Sistema de histórico de pedidos
- [ ] Relatórios e analytics
- [ ] Upload de imagens direto no painel
- [ ] Integração com múltiplos restaurantes
- [ ] Sistema de cupons e promoções
- [ ] Notificações em tempo real
- [ ] App mobile nativa
- [ ] Integração com sistemas de pagamento

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja LICENSE para detalhes

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do WhatsApp.

---

**Desenvolvido com ❤️ por Menu Noir**
