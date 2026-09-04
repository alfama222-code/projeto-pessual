# 📊 Relatório Geral do Projeto e Análise de Vulnerabilidades

Este relatório contém uma avaliação de arquitetura e segurança do projeto Full-Stack (servidor-local e servidor-local-front). Nenhuma alteração foi feita no código original durante esta avaliação.

## Estrutura do Projeto
O seu projeto está estruturado como uma aplicação moderna:
*   **Backend (`servidor-local`)**: Construído com Node.js, Express, e Prisma ORM. Utiliza JWT para autenticação e bcrypt para hashing de senhas.
*   **Frontend (`servidor-local-front`)**: Construído com Next.js 15 (App Router), React 19, TailwindCSS, e componentes do Shadcn UI/Lucide.

A estrutura do projeto é boa, separando bem as responsabilidades (Controllers, Routes, Middlewares, Schemas no backend; e a estrutura de diretórios do Next.js no frontend). No entanto, existem **falhas críticas de segurança e arquitetura** que precisam ser corrigidas antes que este projeto vá para um ambiente de produção.

---

## 🚨 Análise de Vulnerabilidades e Riscos

Aqui estão os principais problemas de segurança e integridade de dados encontrados no código atual:

### 1. Rotas de API Desprotegidas (Falta de Autenticação)
**Nível de Risco: CRÍTICO**
*   **O problema**: No backend, o arquivo `authController.js` gera um token JWT corretamente. No entanto, não existe nenhum middleware verificando esse token nas rotas. Os arquivos `pedidoRoutes.js` e `produtoRoutes.js` estão completamente expostos.
*   **Consequência**: Qualquer pessoa que descobrir a URL da sua API pode criar um pedido ou listar todos os pedidos (inclindo o faturamento e métricas da loja) sem precisar estar logada ou ter uma conta de administrador.

### 2. Manipulação de Preços pelo Cliente (Business Logic Flaw)
**Nível de Risco: CRÍTICO**
*   **O problema**: Em `pedidoController.js` (`criarPedido`), o backend confia cegamente nos dados que vêm do frontend (`req.body.itens`), incluindo o `preco` e o `nome` do produto.
*   **Consequência**: Um usuário mal-intencionado pode interceptar a requisição de compra e enviar um `produtoId` válido, mas com `preco: 0.01` ou `total: 0`. O backend vai registrar e aprovar a compra com esses valores falsos.
*   **Correção Ideal**: O frontend deve enviar apenas o `produtoId` e a `quantidade`. O backend deve buscar o preço real do produto no banco de dados, calcular o total internamente, e só então salvar o pedido.

### 3. Falsa Sensação de Segurança no Frontend
**Nível de Risco: ALTO**
*   **O problema**: O arquivo `middleware.ts` do frontend tem um comentário que diz: *"vamos deixar o /shop passar pelo middleware e deixar que o useEffect dentro da própria página /shop controle o acesso"*.
*   **Consequência**: Proteger rotas verificando o `localStorage` através de um `useEffect` no frontend (Client-Side) é facilmente burlável. Um usuário pode injetar um token falso no `localStorage`, e o frontend vai renderizar a página. Como a API também não tem proteção, ele conseguirá interagir com o sistema como se estivesse autenticado.

### 4. Segredo JWT Hardcoded e Fraco
**Nível de Risco: ALTO**
*   **O problema**: Em `authController.js`, o código usa: `const JWT_SECRET = process.env.JWT_SECRET || 'meu_segredo_super_seguro_123';`. O arquivo `.env` do backend está vazio ou não configurado para o segredo.
*   **Consequência**: A aplicação está usando a string fallback. Qualquer pessoa que tiver acesso a esse código-fonte pode gerar tokens JWT falsos válidos para qualquer usuário e forjar acessos.

### 5. Falta de Validação de Dados (Middlewares Zod)
**Nível de Risco: MÉDIO**
*   **O problema**: Existe um excelente sistema de validação (`validateMiddleware.js` usando Zod) configurado. Ele é usado no `authRoutes.js`, mas **não** está sendo usado nas rotas de produtos e pedidos.
*   **Consequência**: Se o frontend enviar dados incorretos, o Prisma tentará processá-los e poderá gerar erros de banco de dados não tratados que podem derrubar o processo Node.js.

### 6. Política de CORS Muito Aberta
**Nível de Risco: MÉDIO**
*   **O problema**: Em `server.js`, a configuração `app.use(cors());` não possui restrições de origem.
*   **Consequência**: Qualquer outro site na internet pode fazer requisições para a sua API a partir do navegador de um usuário (vulnerável a CSRF, caso fossem usados cookies). Em produção, o ideal é configurar o CORS para aceitar requisições apenas da URL oficial do seu frontend.

### 7. Armazenamento do Token JWT no LocalStorage
**Nível de Risco: MÉDIO/BAIXO (Depende do contexto)**
*   **O problema**: O JWT está sendo salvo e validado através do `localStorage`.
*   **Consequência**: Tokens armazenados no `localStorage` são vulneráveis a ataques de XSS (Cross-Site Scripting). A prática mais recomendada e segura é usar `Cookies HttpOnly`.

---

## 📋 Resumo das Recomendações e Próximos Passos
1. **Criar um `authMiddleware.js`** no backend que verifique o cabeçalho `Authorization` (Bearer token) usando `jwt.verify`.
2. **Aplicar esse middleware** nas rotas privadas em `pedidoRoutes.js`.
3. **Alterar a lógica de `criarPedido`** para que o backend consulte o banco de dados para obter os preços oficiais.
4. **Criar Schemas do Zod** para a criação de pedidos e aplicá-los com o `validateMiddleware`.
5. **Configurar um `.env`** adequado no backend (e frontend) e adicioná-los no `.gitignore`.
6. **Mover a validação de rota do Next.js** para usar Cookies e verificar a autenticação diretamente no `middleware.ts`, bloqueando a página no lado do servidor.
