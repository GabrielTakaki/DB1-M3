# 📱 Sistema de Mensageria - API REST

> Trabalho de **Banco de Dados I** - UNIVALI
> Domínio: Sistema de mensageria (Whatsapp)

## Descrição

API REST desenvolvida em NestJS para gerenciamento de um sistema de mensageria completo, incluindo usuários, chats (individuais e em grupo), participantes e mensagens. O projeto implementa operações CRUD completas para todas as entidades do domínio.

## Stack Tecnológica

- **Node.js** (v18+)
- **NestJS** (Framework)
- **TypeScript**
- **MySQL 8.x** (Banco de dados)
- **mysql2** (Driver MySQL)
- **class-validator** e **class-transformer** (Validação de DTOs)
- **Docker** (Conteirização) - foi usado para maior facilidade na criação do banco de dados

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18.x ou superior ([Download](https://nodejs.org/))
- **MySQL** versão 8.x ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** (geralmente vem com Node.js)
- **Docker** (Nao obrigatorio)

## Como Rodar o Projeto

### Criar e Popular o Banco de Dados

Primeiro, você precisa executar o script SQL para criar o banco de dados e suas tabelas:

```bash
# Conecte-se ao MySQL (ajuste usuário/senha conforme sua instalação)
mysql -u root -p

# Dentro do MySQL, execute o script
source caminho/para/mensageria.sql

# Ou importe diretamente via comando
mysql -u root -p < mensageria.sql
```

O script `mensageria.sql` irá:
- Criar o banco de dados `mensageria`
- Criar as tabelas: `usuario`, `chat`, `chat_participante`, `mensagem`
- Popular com dados de exemplo (se houver)

### Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas credenciais:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações do MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=mensageria
PORT=3000
```

### Instalar Dependências

```bash
npm install
```

### Iniciar a Aplicação
```bash
# Modo de desenvolvimento
npm run start:dev

```

A API estará disponível em: **`http://localhost:3000`**

### ✅ Verificar se está funcionando

Acesse o endpoint de health check:

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok"
}
```

## 📚 Endpoints da API

### 🏥 Health Check

| Método | Endpoint   | Descrição              |
|--------|------------|------------------------|
| GET    | `/health`  | Verifica status da API |

### 👤 Usuario

| Método | Endpoint          | Descrição                    |
|--------|-------------------|------------------------------|
| POST   | `/usuario`        | Criar novo usuário           |
| GET    | `/usuario`        | Listar todos os usuários     |
| GET    | `/usuario/:id`    | Buscar usuário por ID        |
| PATCH  | `/usuario/:id`    | Atualizar usuário            |
| DELETE | `/usuario/:id`    | Remover usuário              |

**Exemplo de body (POST):**
```json
{
  "telefone": "+5511987654321",
  "nome_exibicao": "João Silva",
  "status_recado": "Disponível",
  "foto_url": "https://exemplo.com/foto.jpg"
}
```

### 💬 Chat

| Método | Endpoint       | Descrição                    |
|--------|----------------|------------------------------|
| POST   | `/chat`        | Criar novo chat              |
| GET    | `/chat`        | Listar todos os chats        |
| GET    | `/chat/:id`    | Buscar chat por ID           |
| PATCH  | `/chat/:id`    | Atualizar chat               |
| DELETE | `/chat/:id`    | Remover chat                 |

**Exemplo de body (POST):**
```json
{
  "tipo": "grupo",
  "nome": "Equipe de Desenvolvimento",
  "descricao": "Chat da equipe de devs"
}
```

**Tipos de chat:** `"individual"` ou `"grupo"`

### 👥 Chat_Participante

| Método | Endpoint                                        | Descrição                        |
|--------|-------------------------------------------------|----------------------------------|
| POST   | `/chats/:chatId/participantes`                  | Adicionar participante ao chat   |
| GET    | `/chats/:chatId/participantes`                  | Listar participantes do chat     |
| PATCH  | `/chats/:chatId/participantes/:usuarioId`       | Atualizar papel do participante  |
| DELETE | `/chats/:chatId/participantes/:usuarioId`       | Remover participante do chat     |

**Exemplo de body (POST):**
```json
{
  "usuario_id": 1,
  "papel": "admin"
}
```

**Papéis disponíveis:** `"membro"` ou `"admin"`

### 📨 Mensagem

| Método | Endpoint              | Descrição                          |
|--------|-----------------------|------------------------------------|
| POST   | `/mensagens`          | Enviar nova mensagem               |
| GET    | `/mensagens`          | Listar todas as mensagens          |
| GET    | `/mensagens?chatId=N` | Listar mensagens de um chat        |
| GET    | `/mensagens/:id`      | Buscar mensagem por ID             |
| PATCH  | `/mensagens/:id`      | Atualizar mensagem                 |
| DELETE | `/mensagens/:id`      | Remover mensagem                   |

**Exemplo de body (POST):**
```json
{
  "chat_id": 1,
  "remetente_id": 1,
  "conteudo": "Olá! Esta é uma mensagem de teste.",
  "tipo_conteudo": "texto",
  "respondendo_msg_id": null
}
```

**Tipos de conteúdo:** `"texto"`, `"imagem"`, `"audio"`, `"video"`

## 📬 Postman Collection

O projeto inclui uma **Postman Collection** completa com todos os endpoints configurados.

### Como Importar

1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Selecione o arquivo `mensageria.postman_collection.json` na raiz do projeto
4. Clique em **Import**

### Como Usar

A collection já vem com:
- ✅ Variável `{{baseUrl}}` configurada para `http://localhost:3000`
- ✅ Variáveis dinâmicas que salvam IDs automaticamente (`usuarioId`, `chatId`, etc.)
- ✅ Scripts de teste que encadeiam as requisições
- ✅ Bodies de exemplo válidos para todos os endpoints

**Fluxo recomendado:**
1. Execute `Health Check` para verificar a API
2. Crie usuários com `Criar Usuario` e `Criar Usuario 2`
3. Crie um chat com `Criar Chat`
4. Adicione participantes com `Adicionar Participante`
5. Envie mensagens com `Criar Mensagem`

Os IDs são salvos automaticamente e reutilizados nas próximas requisições!

## 🗂 Estrutura do Projeto

```
src/
├── chat/                    # Módulo de Chats
│   ├── chat.controller.ts
│   ├── chat.service.ts
│   ├── chat.module.ts
│   └── dto/
├── chat_participante/       # Módulo de Participantes
│   ├── chat-participante.controller.ts
│   ├── chat-participante.service.ts
│   ├── chat-participante.module.ts
│   └── dto/
├── mensagem/                # Módulo de Mensagens
│   ├── mensagem.controller.ts
│   ├── mensagem.service.ts
│   ├── mensagem.module.ts
│   └── dto/
├── usuario/                 # Módulo de Usuários
│   ├── usuario.controller.ts
│   ├── usuario.service.ts
│   ├── usuario.module.ts
│   └── dto/
├── database/                # Módulo de Conexão com MySQL
│   └── database.module.ts
├── health/                  # Health Check
│   ├── health.controller.ts
│   └── health.module.ts
├── app.module.ts            # Módulo raiz
└── main.ts                  # Entry point
```

## 🧪 Validações

Todas as requisições possuem validação de dados através de **DTOs** (Data Transfer Objects) usando `class-validator`:

- ✅ Campos obrigatórios
- ✅ Tipos de dados corretos
- ✅ Tamanhos máximos (telefone, nome, etc.)
- ✅ Valores permitidos em enums (tipo de chat, papel, tipo de conteúdo)

## 📝 Observações

- O arquivo `.env` está no `.gitignore` e não deve ser versionado
- O arquivo `.env.example` serve como template para configuração
- Certifique-se de que o MySQL está rodando antes de iniciar a aplicação
- A API usa a porta 3000 por padrão (configurável via `PORT` no `.env`)
- Caso utilize da ferramente Docker, basta utilizar o comando para criar um banco:
```bash
# Container do banco de dados MySql
docker compose up -d
```

## 👨‍💻 Desenvolvido por
**Gabriel Junkes Takaki e Nycolas Alberto Darosci**

Trabalho acadêmico - Banco de Dados I
Universidade do Vale do Itajai

