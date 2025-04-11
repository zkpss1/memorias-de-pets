# Memórias de Pets

Aplicativo para registrar e compartilhar momentos especiais com seus pets.

## Sobre o Projeto

Este é um aplicativo web desenvolvido com Next.js, React, TypeScript e TailwindCSS. O armazenamento de dados é feito localmente no navegador utilizando localStorage.

## Deploy no Render

Para fazer o deploy deste aplicativo no Render, siga os passos abaixo:

1. Crie uma conta no [Render](https://render.com/) caso ainda não tenha
2. Clique em "New +" e selecione "Web Service"
3. Conecte ao repositório GitHub onde o código está hospedado
4. Configure o serviço com as seguintes informações:
   - **Nome**: pet-memory-app (ou outro nome de sua preferência)
   - **Ambiente**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Clique em "Create Web Service"

## Variáveis de Ambiente

Se necessário, configure as seguintes variáveis de ambiente no Render:

- `NODE_ENV`: production

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar servidor de produção
npm start
```
