# Publicação no GitHub Pages (com subpasta)

A aplicação foi configurada para ser hospedada estaticamente no GitHub Pages sob a URL:
`https://rauldesigner.com.br/iamurel/`

## 1. Como a arquitetura funciona

Ao hospedar React (SPA) em um servidor estático como o GitHub Pages, atualizações de página diretas (ex: acessar `/iamurel/admin/` diretamente) resultam em erro 404, porque o arquivo `/admin/index.html` não existe fisicamente.

Para resolver isso, adotamos a arquitetura do [spa-github-pages](https://github.com/rafrex/spa-github-pages):
1. **`vite.config.ts`**: Configurado com `base: '/iamurel/'`.
2. **`BrowserRouter`**: Usa `basename="/iamurel"`.
3. **`public/404.html`**: Intercepta requisições não encontradas, transforma a URL original em uma query string (`/?/admin`) e redireciona de volta para `index.html`.
4. **`index.html`**: Contém um script no `<head>` que lê essa query string, reescreve a URL no navegador usando `history.replaceState` e entrega o roteamento correto para o React.

## 2. Como publicar

### Opção A: Usando GitHub Actions (Recomendado)

1. Vá até as configurações do repositório no GitHub > **Pages**.
2. Em **Source**, escolha **GitHub Actions**.
3. Crie um workflow em `.github/workflows/deploy.yml` (ou use a opção sugerida pelo GitHub para Node.js).
   - O comando de build deve ser: `npm run build`
   - O diretório a ser publicado: `dist`

### Opção B: Build e deploy manual com pacote `gh-pages`

1. Instale o pacote: `npm install -D gh-pages`
2. Adicione ao `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Execute `npm run deploy`. O código transpilado será enviado para a branch `gh-pages`.
4. Nas configurações do repositório, defina a origem do GitHub Pages como a branch `gh-pages`.

O site entrará no ar rapidamente no domínio configurado.
