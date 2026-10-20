# Publicação da nova proposta IAMUREL

## Hospedagem comum / cPanel / FTP

Envie estes itens para a pasta onde a proposta ficará publicada:

- `index.html`
- `app.js`
- `config.js`
- `img/`
- `manus-routes.json` — pode ser mantido ou ignorado pela hospedagem comum

A página é estática. Não é necessário instalar Node.js ou banco de dados.

Se a URL for `https://seudominio.com.br/iamurel/tabela/`, mantenha todos os arquivos dentro dessa pasta e preserve a pasta `img/` no mesmo nível do `index.html`.

## Servidor Node.js

Se a hospedagem usar Node.js, envie também `package.json` e `server.js`. Execute:

```bash
npm start
```

O servidor usa a variável `PORT` quando fornecida e utiliza `3000` como padrão.

## Personalização

Edite somente `config.js` para alterar telefone do WhatsApp, Instagram, e-mail, validade, planos, preços, entregas, exemplos e perguntas do quiz.

As imagens usadas atualmente estão dentro de `img/`.
