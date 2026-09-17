# Modelo de Dados (Supabase)

Todas as tabelas do projeto recebem o prefixo `iamurel_` para evitar colisões em bancos compartilhados.

## Tabelas Principais

### `iamurel_site_settings`
Contém configurações globais.
- *Permissões:* Leitura pública, Escrita apenas Admin.
- *Campos:* Nome, Descrição, Textos de Hero e CTAs.

### `iamurel_leads`
Coração do CRM (Customer Relationship Management).
- *Permissões:* Inserção pública (anônima), Leitura e Escrita apenas Admin. NUNCA expor SELECT público.
- *Campos:* name, email, business_name, status (Enum), timeframe, message, etc.

### `iamurel_services` & `iamurel_packages`
Gerenciamento comercial (CMS).
- *Permissões:* Leitura pública quando `status = 'active'`. Escrita Admin.
- Os pacotes se relacionam com `iamurel_package_items` via `package_id` com Deleção em Cascata.

## Políticas de Segurança (RLS - Row Level Security)
A segurança no frontend do Supabase não deve depender de esconder botões, mas das regras do banco. 
As regras criadas bloqueiam o acesso a qualquer query não autorizada diretamente no banco.

## Enumerações (Tipos)
Foram criados os Enums `lead_status`, `package_level` e `active_status` no PostgreSQL para garantir a consistência dos dados que transitam pelo Kanban e painel de controle.
