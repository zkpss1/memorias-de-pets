# Instruções para Push do Projeto para o GitHub

Este documento contém as instruções para enviar seu projeto "Memórias de Pets" para um repositório GitHub.

## Pré-requisitos

1. Instalar o Git no seu computador
   - Baixe o instalador do Git em: https://git-scm.com/downloads
   - Execute o instalador e siga as instruções

2. Criar uma conta no GitHub (se ainda não tiver)
   - Acesse https://github.com/signup e siga as instruções

## Passos para enviar o projeto para o GitHub

### 1. Criar um novo repositório no GitHub

1. Faça login na sua conta do GitHub
2. Clique no botão "+" no canto superior direito e selecione "New repository"
3. Dê um nome ao repositório (ex: "memorias-de-pets")
4. Adicione uma descrição (opcional): "Aplicativo para registrar momentos especiais com pets"
5. Deixe o repositório como público (ou privado, se preferir)
6. NÃO inicialize o repositório com README, .gitignore ou licença
7. Clique em "Create repository"

### 2. Inicializar o Git no projeto local

Abra o terminal (PowerShell ou CMD) na pasta do projeto e execute os seguintes comandos:

```bash
# Inicializar o Git no projeto
git init

# Adicionar todos os arquivos ao Git
git add .

# Criar o primeiro commit
git commit -m "Versão inicial do aplicativo Memórias de Pets"

# Adicionar o repositório remoto (substitua 'SEU_USUARIO' pelo seu nome de usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/memorias-de-pets.git

# Enviar o código para o GitHub
git push -u origin master
# OU, se estiver usando a branch 'main' como padrão
git push -u origin main
```

### 3. Verificar se o push foi bem-sucedido

1. Acesse seu repositório no GitHub
2. Verifique se todos os arquivos foram enviados corretamente

## Comandos Git úteis para o futuro

```bash
# Ver o status do repositório
git status

# Adicionar alterações
git add .

# Criar um novo commit
git commit -m "Descrição das alterações"

# Enviar alterações para o GitHub
git push

# Atualizar seu repositório local com alterações do GitHub
git pull
```

## Notas importantes

- Lembre-se de não compartilhar informações sensíveis (como chaves de API) no GitHub
- O arquivo `.gitignore` já está configurado para ignorar arquivos desnecessários
- Se você encontrar problemas de autenticação, pode ser necessário configurar um token de acesso pessoal no GitHub
