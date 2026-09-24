# WESPOP

Bem-vindo ao repositório do **WESPOP**, um e-commerce minimalista focado na venda de produtos masculinos, femininos e personalizados.

Este documento foi criado para orientar você, cliente, sobre como colocar o projeto no ar, configurar banco de dados, meios de pagamento e como gerenciar os arquivos de configuração (o famoso `.env`).

---

## 1. O que este sistema precisa para rodar?

Este sistema foi construído usando tecnologias modernas (Node.js, React, Banco de Dados MySQL e integração com Mercado Pago). Para que tudo funcione perfeitamente, você precisará de:

1. **Hospedagem com suporte a Node.js**: Onde o sistema vai ficar ligado 24h por dia.
2. **Banco de Dados MySQL**: Para salvar os produtos, categorias e usuários.
3. **Conta no Mercado Pago**: Para gerar os tokens de pagamento (produção e teste) e receber as vendas.
4. **Domínio**: O endereço do seu site (ex: `www.wespop.com.br`).

---

## 2. Qual Hospedagem Comprar? (Hostinger ou HostGator)

Para Node.js + MySQL, as duas empresas oferecem soluções. A **Hostinger** costuma ter melhor desempenho e painel mais simples para aplicações Node.js no momento.

### Opção 1: Hostinger (Recomendado)

- **Plano**: Você pode usar um plano de "Hospedagem Cloud" ou "VPS" (se tiver um desenvolvedor para gerenciar). A Hostinger possui a **Hospedagem Business** (compartilhada premium) ou planos **Cloud**, que costumam oferecer suporte nativo a Node.js pelo painel hPanel.
- **Vantagem**: Muito rápido, fácil integração de Node.js no painel hPanel.

### Opção 2: HostGator

- **Plano**: Planos a partir do **Hospedagem Turbo** ou **VPS**. Em planos compartilhados da HostGator (M ou Turbo), o suporte a Node.js é feito via cPanel (com a ferramenta "Setup Node.js App").
- **Vantagem**: Suporte nacional forte, cPanel tradicional.

---

## 3. Passo a Passo de Instalação na Hospedagem

Caso você mesmo ou seu desenvolvedor vá fazer o deploy, aqui está o resumo do que precisa ser feito no painel da hospedagem (cPanel ou hPanel):

1. **Criar Banco de Dados MySQL**:
   - No painel de controle, vá em "Bancos de Dados MySQL".
   - Crie um banco (ex: `wespop_db`).
   - Crie um usuário com senha forte e dê todos os privilégios a este banco.
   - Anote esses dados (Host, Nome do Banco, Usuário e Senha), você usará no `.env`.

2. **Enviar os Arquivos**:
   - Suba todos os arquivos deste projeto para o gerenciador de arquivos ou via Git/FTP (não envie a pasta `node_modules`).

3. **Configurar o App Node.js**:
   - No painel da hospedagem (hPanel ou cPanel), procure por **"Setup Node.js App"** ou **"Node.js"**.
   - Defina a raiz do projeto (onde você subiu os arquivos).
   - Defina a versão do Node.js (versão 18, 20 ou superior).
   - Rode o comando de instalação de dependências: `npm install`.
   - Rode o comando para fazer o build de produção: `npm run build`.
   - Defina o script de inicialização apontando para a pasta correta do servidor gerado pelo build (geralmente gerado na pasta `.output` ou `dist`, confirme com a documentação do servidor configurado).

4. **Inicializar o Banco de Dados**:
   - Para criar as tabelas do banco automaticamente, o sistema possui scripts prontos.
   - Pelo terminal ou gerenciador Node da hospedagem, rode os comandos:
     `npm run db:init`
     `npm run db:seed` (para popular com produtos de exemplo, caso deseje).

---

## 4. O que mudar no arquivo `.env`

O arquivo `.env` (ou `.env.example`) guarda os segredos do seu sistema, como senhas e integrações bancárias. **Nunca passe esse arquivo para o público.**
Na sua hospedagem (ou localmente), você precisa ter um arquivo chamado apenas `.env` com as seguintes informações preenchidas com os seus dados reais:

```env
# Banco de Dados MySQL (Pegue estes dados lá no passo de criação do banco na hospedagem)
VITE_MYSQL_HOST=localhost            # Ou o IP fornecido pela hospedagem (na Hostinger/HostGator costuma ser localhost)
VITE_MYSQL_PORT=3306                 # Geralmente é 3306
VITE_MYSQL_DATABASE=nome_do_banco    # O nome do banco que você criou
VITE_MYSQL_USER=usuario_do_banco     # O usuário do banco que você criou
VITE_MYSQL_PASSWORD=senha_do_banco   # A senha forte que você definiu

# Segurança do Sistema (Autenticação JWT)
VITE_JWT_SECRET=escreva_aqui_um_segredo_muito_longo_e_aleatorio
# (Exemplo: misture letras, numeros e simbolos - mínimo 32 caracteres)

# Integração Mercado Pago
VITE_MP_ACCESS_TOKEN=APP_USR-1234567890-X-X
# (Pegue este Access Token dentro da sua conta do Mercado Pago > Seu Negócio > Configurações > Gestão e Administração > Credenciais de Produção)
```

### Onde pegar o Token do Mercado Pago?

1. Acesse o painel de desenvolvedor do Mercado Pago.
2. Vá em **Suas integrações** e crie uma nova aplicação (ou abra uma existente).
3. Na seção "Credenciais de Produção", copie o **Access Token**. (Use credenciais de teste enquanto o site não estiver pronto para vendas reais).

---

## 5. Desenvolvimento Local (Para Programadores)

Se alguém for trabalhar no código do site no computador, estes são os comandos necessários (requer Node.js instalado):

```sh
# 1. Instalar as dependências
npm install

# 2. Configurar o banco (lembre-se de rodar um MySQL local, como XAMPP ou Docker, e configurar o .env)
npm run db:init

# 3. Rodar o projeto em modo de desenvolvimento
npm run dev
```

Qualquer alteração no código será atualizada em tempo real no navegador em `http://localhost:5173`.
