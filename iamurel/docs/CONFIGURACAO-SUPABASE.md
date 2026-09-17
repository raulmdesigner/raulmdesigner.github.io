# Configuração do Supabase

O projeto **IAMUREL** foi projetado para utilizar o Supabase como backend-as-a-service (BaaS) para autenticação, banco de dados e políticas de segurança (RLS).

## 1. Criação do Projeto

1. Acesse [Supabase](https://supabase.com) e crie um novo projeto.
2. Anote a **URL do Projeto** e a **Anon Key** (disponíveis nas configurações de API do seu painel).

## 2. Configuração do Banco de Dados

1. Acesse o menu **SQL Editor** no painel do Supabase.
2. Copie todo o conteúdo do arquivo `supabase/schema.sql` deste repositório.
3. Cole no editor SQL e execute (Run). 
4. Isso criará:
   - Todas as tabelas com prefixo `iamurel_`.
   - Os tipos Enum necessários.
   - O RLS (Row Level Security) bloqueando acesso indevido.
   - As políticas (policies) permitindo leitura pública controlada, inserção anônima de leads e acesso total ao administrador.

## 3. Configuração do Ambiente Local

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
VITE_SUPABASE_URL="Sua URL do Supabase aqui"
VITE_SUPABASE_ANON_KEY="Sua Anon Key do Supabase aqui"
```

## 4. Segurança e Produção

- O painel está bloqueado para leitura por RLS para qualquer usuário não autenticado.
- Em produção, configure o domínio do GitHub Pages (`https://rauldesigner.com.br/iamurel/`) como URL de redirecionamento autorizada nas configurações de **Authentication** > **URL Configuration** do Supabase.

> **Importante:** Como não configuramos credenciais reais no momento da criação, a aplicação funcionará em "Modo de Demonstração" no navegador, utilizando o estado de fallback em `src/lib/data.ts`.
