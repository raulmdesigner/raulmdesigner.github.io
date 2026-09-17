# Checklist de Testes (QA)

Antes de considerar a publicação completa, os seguintes itens foram validados no ambiente local e precisam ser testados em produção:

- [x] **Roteamento Base:** A aplicação inicializa corretamente em `/iamurel/` e `/iamurel/admin/`.
- [x] **Redirecionamento 404:** O arquivo `404.html` manipula acessos diretos no GitHub Pages e redireciona para o roteamento do React.
- [x] **Acessibilidade de Cores:** Contraste da cor `--color-action` (Burnt Coral) contra o fundo `--color-surface` (Ivory) foi testado visualmente.
- [x] **Captação de Lead:** 
   - Preenchimento do formulário no final da Landing Page.
   - Validação de campos obrigatórios nativa do HTML.
   - Mock ou inserção real bem-sucedida mudando o estado para "Solicitação enviada".
- [x] **Funil CRM (Kanban):**
   - O card do lead salvo deve aparecer na primeira coluna.
   - Mudança de status via *Select* (como alternativa acessível ao Drag & Drop).
- [x] **Fallback do Supabase:**
   - Ao rodar sem variáveis de ambiente `.env`, a aplicação não quebra na tela branca. O fallback para o `mockData` ocorre com alerta administrativo.
- [x] **Responsividade:**
   - Hero text redimensiona no mobile (uso de md:text-7xl e padrão text-5xl).
   - O formulário encolhe da grid de 2 colunas para 1.
   - O Sidebar do Admin vira um layout empilhado (flex-col md:flex-row).
- [x] **Produção:**
   - O comando `npm run build` executa sem erros de lint ou Typescript.
