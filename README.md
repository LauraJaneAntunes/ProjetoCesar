# 🚀 Segurança da Informação - Projeto

## 👤 Integrantes

- Laura Jane Antunes
- Mariana A. K. Hirata

## 📖 Descrição

Este projeto explora conceitos e práticas essenciais de **segurança da informação**, com o objetivo de implementar soluções eficazes para proteger dados e sistemas.

## 🗂️ Estrutura do Projeto

- **`/app`**: Diretório principal para rotas no novo sistema de roteamento do Next.js (App Router). Contém páginas e layouts.
- **`/components`**: Onde ficam os componentes reutilizáveis da interface.
- **`/hooks`**: Hook personalizado para exibir notificações do tipo toast (mensagens rápidas que aparecem no canto da tela).
- **`/lib`**: Autenticação, implementação da lógica da cifra de César, conexão com o banco de dados e utilidades genéricas.

PROJETOCESAR/
├── .next/
├── node_modules/
├── public/
└── src/
    └── app/
        ├── api/
        │   └── auth/
        │       └── register/
        │           └── route.js
        │   └── login/
        │           └── route.js
        │   └── save-hash/
        │       └── route.js
        └── components/
            └── navbar.js
        └── decrypt/
            └── page.js
        └── encrypt/
            └── page.js
        └── libs/
            ├── auth.js
            ├── caesar.js
            └── db.js
    ├── favicon.ico
    ├── globals.css
    ├── layout.js
    └── page.js
├── .env
├── .env.example
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── README.md

💡 **Dica**: Mantenha seus sistemas seguros e atualizados! 🔒

---

## 🚧 Como rodar o projeto

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   ```
2. Instale as dependências:

   ```bash
   npm install
   ```
3. Rode o projeto:

   ```bash
   npm run dev
   ```
4. Acesse:

   ```
   http://localhost:3000
   ```

---

## 🎯 Funcionalidades

- 🔐 Criptografia de mensagens com cifra de César
- 🔑 Sistema de autenticação de usuários
- 📢 Exibição de mensagens de alerta/toast
- 🧩 Layout responsivo com navegação intuitiva
- 🗝 Autenticação via JWT

---

## 🔒 Conceitos de Segurança da Informação

- **Confidencialidade**: uso da cifra de César para proteger dados sensíveis
- **Autenticação e controle de acesso**: módulo `auth.ts`
- **Boas práticas de desenvolvimento seguro**
- **Gerenciamento de sessões e dados**

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**.
Sinta-se livre para usar, modificar e compartilhar com atribuição.
