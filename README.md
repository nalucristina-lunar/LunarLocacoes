# Lunar Locações - Plataforma de Gestão e Catálogo de Equipamentos

A plataforma **Lunar Locações** é uma solução de ponta a ponta desenvolvida para a gestão eficiente e exibição digital de catálogos de locação de equipamentos, máquinas e ferramentas. Projetada com foco em alta disponibilidade, performance otimizada (SEO avançado) e escalabilidade, a aplicação atende tanto às necessidades de atração de clientes quanto à administração do inventário de produtos e categorias.

## 🎯 Arquitetura e Tecnologias

A arquitetura do sistema foi desenhada utilizando as práticas modernas de desenvolvimento de software, garantindo robustez, segurança e manutenibilidade:

*   **Front-end & Middleware:** [Next.js 15+](https://nextjs.org/) (App Router) e [React 19](https://react.dev/), oferecendo renderização híbrida (Server-Side Rendering e Static Site Generation) para uma performance superior e otimização para motores de busca (SEO).
*   **Estilização e UI/UX:** [Tailwind CSS v4](https://tailwindcss.com/) para componentização ágil, garantindo uma interface extremamente responsiva e com carregamentos fluidos.
*   **Banco de Dados & ORM:** [Prisma ORM](https://www.prisma.io/) em conjunto com [Supabase (PostgreSQL)](https://supabase.com/), entregando um modelo de dados relacional e seguro.
*   **Gestão de Mídia Cloud:** Integração com [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) para o armazenamento otimizado, upload direto pelo painel e entrega acelerada de imagens.
*   **Segurança:** Implementação de JWT Edge-compatible (via [Jose](https://github.com/panva/jose)) e hash de credenciais ([Bcrypt.js](https://www.npmjs.com/package/bcryptjs)) para as rotas administrativas. Adoção de Políticas de Segurança de Conteúdo (CSP) com injetores de *nonce* dinâmicos, protegendo a plataforma contra ataques de injeção e XSS.
*   **Tipagem Estrita:** [Zod](https://zod.dev/) para assegurar a consistência e integridade de todos os esquemas trafegados entre cliente e servidor (End-to-End Type Safety).

## ⚙️ Principais Funcionalidades

### 1. Experiência do Cliente (Catálogo Público)
*   **Catálogo Digital Dinâmico e Categorizado:** Navegação intuitiva pelo portfólio de equipamentos, com suporte a múltiplas imagens, descrições detalhadas e indicadores de disponibilidade.
*   **Performance Visual *(Shimmer Skeletons)*:** Estados de carregamento gerenciados com *skeletons* animados, evitando *Cumulative Layout Shifts* e melhorando a percepção de performance.
*   **Comunicação Integrada e *Real-time*:** Configurações de contato (WhatsApp, E-mail) gerenciáveis via painel de administração e sincronizadas dinamicamente em toda a aplicação.
*   **Tratamentos Inteligentes de Exceção:** Interfaces padronizadas para erros de validação e rotas não encontradas (404), garantindo uma navegação coesa.

### 2. Painel de Controle (Gestão e Administração)
*   **Dashboard Seguro (Área Restrita `/admin`):** Acesso autenticado para controle total do acervo.
*   **Gestão Direta (CRUD Completo):** Inclusão, edição, categorização e exclusão de produtos e categorias, com upload de mídia embarcado no fluxo de criação.
*   **Gerenciamento de Contatos:** Alteração dinâmica de dados de contato diretamente pelo painel administrativo.

## 🚀 Guia de Operação e Implantação Local

Para reproduzir o ambiente de desenvolvimento localmente, siga as instruções abaixo:

### Pré-requisitos
*   **Node.js**: Versão 18.x LTS ou superior (20+ recomendado).
*   **npm**: Gerenciador de pacotes padrão.

### 1. Instalação

```bash
git clone https://github.com/gbetsa/lunarlocacoes.git
cd lunarlocacoes
npm install
```

### 2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto contendo as seguintes credenciais:

```env
# Conexão com o Banco de Dados (Supabase/PostgreSQL)
# Connection pool (geralmente porta 6543)
DATABASE_URL="sua_url_de_conexao"

# Conexão direta para migrações (geralmente porta 5432)
DIRECT_URL="sua_url_direta"

# Vercel Blob Armazenamento
VERCEL_BLOB_URL="sua_url_do_vercel_blob" # Preenchido automaticamente pela Vercel no momento do deploy
BLOB_READ_WRITE_TOKEN="seu_token_do_vercel_blob"

# Autenticação JWT
JWT_SECRET="chave_secreta_para_geracao_dos_tokens_jwt"

# URL Base da Aplicação
NEXT_PUBLIC_BASE_URL="https://lunarlocacoes.com.br"

# Credenciais de Administrador Padrão (utilizado no Seed Inicial)
ADMIN_EMAIL="admin@exemplo.com"
ADMIN_PASSWORD="sua_senha_segura"
ADMIN_NAME="Nome do Admin"
```

### 3. Banco de Dados e Migrações

Gere o cliente do Prisma e aplique as tabelas no banco de dados configurado:

```bash
npm run db:generate
npm run db:migrate
```

*(Opcional)* Script de seed inicial da base de dados:
```bash
npm run db:seed
```

### 4. Execução do Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). A área administrativa está disponível na rota `/login`.

## 📦 Referência de Scripts (`package.json`)

*   `npm run dev`: Inicializa em modo de desenvolvimento.
*   `npm run build`: Otimiza e empacota a aplicação para produção.
*   `npm run start`: Inicia o servidor local de produção.
*   `npm run lint`: Checagem programática (ESLint).
*   `npm run db:generate`: Regenera os artefatos TypeScipt do Prisma.
*   `npm run db:migrate`: Aplica as migrações (Ideal para deploy).
*   `npm run db:push`: Sincroniza o schema diretamente sem migrações formais.
*   `npm run db:seed`: Roda o script inicial `prisma/seed.ts`.

## 🌐 Deploy em Produção (Vercel)

Esta aplicação é arquitetada primariamente para deploy na plataforma [Vercel](https://vercel.com/).
1. Conecte seu repositório à Vercel.
2. Configure **todas as variáveis de ambiente** no painel do projeto.
3. No comando de "Build", garanta que as migrações sejam executadas na fase de pre-build:
   ```bash
   npm run db:generate && npm run db:migrate && npm run build
   ```
.
