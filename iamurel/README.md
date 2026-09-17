# IAMUREL — Conteúdo com direção. Design com intenção.

> **IAMUREL** é uma empresa AI-First de criação de conteúdo, design gráfico e direção criativa. Unimos a velocidade da inteligência artificial na pesquisa e exploração de ideias com o rigor da direção humana no contexto, curadoria, acabamento e intenção comercial.

---

## Sumário
1. [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
2. [Estrutura de Diretórios](#estrutura-de-diretórios)
3. [Guia de Instalação e Execução Local](#guia-de-instalação-e-execução-local)
4. [Configuração do Banco de Dados (Supabase)](#configuração-do-banco-de-dados-supabase)
5. [Ordem de Execução dos Scripts SQL](#ordem-de-execução-dos-scripts-sql)
6. [Publicação no GitHub e GitHub Pages](#publicação-no-github-e-github-pages)
7. [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## 1. Arquitetura e Tecnologias

- **Frontend:** React 19 + TypeScript + Vite
- **Estilização:** Tailwind CSS (Tokens visuais dedicados: marfim suave `#FDFDFB`, carvão profundo `#242422`, coral queimado `#D95B43` e verde-petróleo `#1A5F6A`)
- **Tipografia:** Playfair Display (Display / Títulos) + Plus Jakarta Sans (Corpo e Leitura)
- **Roteamento:** React Router v7 com suporte a subpasta `/iamurel/` e SPA fallback para GitHub Pages
- **Backend & Database:** Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **Ícones:** Lucide React

---

## 2. Estrutura de Diretórios

```text
iamurel/
├── .env.example              # Exemplo de credenciais de ambiente
├── index.html                # Ponto de entrada com script SPA para GitHub Pages
├── metadata.json             # Metadados da aplicação
├── package.json              # Dependências e scripts npm
├── vite.config.ts            # Configuração Vite com base dinâmica (/iamurel/)
├── public/
│   └── 404.html              # Redirecionamento SPA para evitar erro 404 no GitHub Pages
├── src/
│   ├── main.tsx              # Ponto de entrada React
│   ├── App.tsx               # Wrapper com BrowserRouter dinâmico
│   ├── routes.tsx            # Rotas públicas e administrativas
│   ├── index.css             # Tokens de cores, fontes e Tailwind CSS
│   ├── components/
│   │   └── layout/
│   │       ├── PublicLayout.tsx   # Header público com âncoras e Footer institucional
│   │       └── AdminLayout.tsx    # Sidebar e navegação do Painel Administrativo
│   ├── lib/
│   │   ├── data.ts           # Camada agnóstica de acesso a dados (Supabase + Fallback)
│   │   ├── mockData.ts       # Dados de demonstração para desenvolvimento offline
│   │   └── supabase.ts       # Instanciação do cliente Supabase
│   ├── pages/
│   │   ├── public/
│   │   │   └── Home.tsx      # Jornada de conversão completa (Diagnóstico, Método, Pacotes, Form)
│   │   └── admin/
│   │       ├── Dashboard.tsx # Métricas de leads, conversão e visão geral
│   │       └── LeadsCRM.tsx  # Pipeline Kanban com alteração de status
│   └── types/
│       └── index.ts          # Interfaces TypeScript do modelo de dados
├── supabase/
│   ├── README.md             # Guia rápido específico do Supabase
│   ├── schema.sql            # Criação de extensões, enums, tabelas, índices e RLS
│   └── seed.sql              # Dados iniciais comerciais (serviços, pacotes, FAQ)
└── docs/
    ├── CONFIGURACAO-SUPABASE.md # Passo a passo detalhado no Supabase
    ├── MODELO-DE-DADOS.md       # Dicionário de dados e relações
    ├── PUBLICACAO-GITHUB.md     # Publicação no repositório e subpasta
    └── CHECKLIST-TESTES.md      # Testes de QA e critérios de aceitação
```

---

## 3. Guia de Instalação e Execução Local

### Pré-requisitos
- Node.js 18+ instalado
- Git configurado

### Passo a passo
```bash
# 1. Clone o repositório
git clone https://github.com/raulmdesigner/iamurel.git
cd iamurel

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com sua URL e Anon Key do Supabase (veja a seção 4)

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O site estará acessível em `http://localhost:3000` (ou porta indicada no terminal).

---

## 4. Configuração do Banco de Dados (Supabase)

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta ou faça login.
2. Crie um novo projeto (ex: `iamurel-db`). Escolha uma senha segura para o banco de dados.
3. No painel do projeto, vá em **Project Settings** > **API**.
4. Copie os seguintes valores:
   - **Project URL** (ex: `https://xyzcompany.supabase.co`)
   - **Project API Keys** > `anon` / `public`
5. Cole esses valores no seu arquivo `.env`:
   ```env
   VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
   VITE_SUPABASE_ANON_KEY="sua-anon-key-aqui"
   ```

---

## 5. Ordem de Execução dos Scripts SQL

Para inicializar o banco sem qualquer conflito de dependência de chaves estrangeiras ou tipos, siga rigorosamente esta sequência no **SQL Editor** do Supabase:

### 1º Passo: `supabase/schema.sql`
- **Onde executar:** Supabase > SQL Editor > New query
- **O que faz:**
  1. Habilita a extensão `uuid-ossp`.
  2. Cria os tipos enumerados (`lead_status`, `package_level`, `package_price_type`, etc.).
  3. Cria as 10 tabelas relacionais com prefixo `iamurel_`.
  4. Ativa o **Row Level Security (RLS)** em todas as tabelas.
  5. Cria as políticas de segurança:
     - Leitura pública apenas para dados comerciais marcados como ativos.
     - Inserção anônima de leads (com bloqueio estrito de leitura para visitantes).
     - Permissão de administração restrita a usuários autenticados.
  6. Cria índices de performance (`idx_leads_status`, `idx_services_order`, etc.).

### 2º Passo: `supabase/seed.sql`
- **Onde executar:** Supabase > SQL Editor > New query
- **O que faz:**
  1. Insere as configurações e textos institucionais da IAMUREL.
  2. Insere os 4 serviços comerciais pré-configurados.
  3. Insere os 4 pacotes (Essencial, Recomendado, Profissional e Ultra) com todos os itens discriminados.
  4. Insere os estudos conceituais de demonstração.
  5. Insere as perguntas e respostas frequentes (FAQ).

---

## 6. Publicação no GitHub e GitHub Pages

O site foi desenvolvido para operar sob a subpasta:
`https://rauldesigner.com.br/iamurel/`

### Configuração no GitHub Pages
1. No seu repositório no GitHub (`raulmdesigner/iamurel`), vá em **Settings** > **Pages**.
2. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
3. Se preferir deploy via branch:
   ```bash
   npm run build
   # O diretório 'dist' conterá todos os arquivos prontos, incluindo o 404.html
   ```
4. Caso use domínio personalizado (`rauldesigner.com.br`), configure o CNAME nas configurações de Pages ou na raiz do repositório conforme sua infraestrutura existente.

---

## 7. Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_SUPABASE_URL` | URL da API REST do Supabase | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anônima do Supabase | `eyJhbGciOi...` |
| `VITE_BASE_PATH` | Caminho base para deploy (opcional) | `/iamurel/` ou `/` |
