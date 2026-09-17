# Supabase — IAMUREL Database Documentation

Este diretório contém a modelagem relacional, definições de segurança e dados iniciais para o produto **IAMUREL**.

## Ordem de Execução no SQL Editor do Supabase

Para inicializar o banco de dados sem erros de dependência, execute os scripts exatamente na seguinte ordem:

```text
Passo 1: supabase/schema.sql  -> Cria extensões, tipos (Enums), tabelas, RLS e índices.
Passo 2: supabase/seed.sql    -> Popula as configurações globais, serviços, pacotes e FAQs.
```

---

### Passo 1 — Executar `supabase/schema.sql`
1. Acesse o dashboard do seu projeto no [Supabase](https://supabase.com).
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Clique em **New query**.
4. Copie todo o conteúdo do arquivo `supabase/schema.sql` e cole no editor.
5. Clique no botão verde **Run** (ou pressione `Ctrl + Enter` / `Cmd + Enter`).
6. Verifique se o resultado retornou `Success. No rows returned`.

**O que este script cria:**
- Extensão `uuid-ossp` para geração de identificadores únicos.
- Tipos Enum personalizados: `lead_status`, `lead_priority`, `package_level`, `package_price_type`, `active_status`, `task_status`.
- 10 tabelas com prefixo `iamurel_`:
  - `iamurel_site_settings`: Configuração e textos institucionais.
  - `iamurel_services`: Especialidades comerciais.
  - `iamurel_packages`: Níveis comerciais de contratação.
  - `iamurel_package_items`: Entregas detalhadas de cada pacote.
  - `iamurel_showcases`: Casos de estudo e demonstrações.
  - `iamurel_faq`: Perguntas frequentes e respostas.
  - `iamurel_leads`: Registro comercial de contatos recebidos.
  - `iamurel_lead_notes`: Anotações internas sobre cada lead.
  - `iamurel_lead_events`: Auditoria de movimentação no funil.
  - `iamurel_tasks`: Tarefas e follow-ups comerciais.
  - `iamurel_audit_log`: Registro de auditoria do CMS.
- **Políticas RLS (Row Level Security):**
  - Leitura pública apenas para conteúdos visíveis (`status = 'active'`).
  - Inserção anônima permitida para formulários de lead.
  - Bloqueio de leitura anônima de leads (privacidade e conformidade total com LGPD).
  - Acesso total de leitura e escrita restrito a usuários autenticados (`auth.role() = 'authenticated'`).

---

### Passo 2 — Executar `supabase/seed.sql`
1. No **SQL Editor**, abra uma nova aba (**New query**).
2. Copie todo o conteúdo do arquivo `supabase/seed.sql` e cole no editor.
3. Clique em **Run**.
4. Verifique a mensagem de sucesso.

**O que este script insere:**
- Informações iniciais da IAMUREL (títulos, subtítulos e CTAs).
- 4 serviços estruturados com escopo, para quem é e o que não inclui.
- 4 pacotes (Essencial, Recomendado, Profissional, Ultra) com todos os itens discriminados.
- 2 estudos conceituais para demonstração.
- 5 perguntas frequentes respondendo às principais objeções comerciais.

---

## Verificação dos Dados
Para confirmar que tudo foi executado com sucesso:
1. Vá até o menu **Table Editor** no Supabase.
2. Verifique se a tabela `iamurel_site_settings` possui 1 linha.
3. Verifique se `iamurel_services` possui 4 linhas e `iamurel_packages` possui 4 linhas.
