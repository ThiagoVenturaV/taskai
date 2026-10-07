# Task AI — Monorepo

Kanban board com gestão de tarefas por agente de IA (Groq · GPT-OSS 120B).

## Estrutura

```
taskai/
├── frontend/   # React + Vite + TypeScript
└── backend/    # Node.js + Express + SQLite + bcrypt
```

## Setup Rápido

### 1. Backend

```bash
cd backend
cp .env.example .env   # Preencha JWT_SECRET e GROQ_API_KEY
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # Preencha apenas VITE_API_BASE_URL
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`  
O backend ficará disponível em `http://localhost:3001`

## Variáveis de Ambiente

### Backend (`backend/.env`)
| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão: 3001) |
| `JWT_SECRET` | Segredo para assinar tokens JWT |
| `GROQ_API_KEY` | Chave da API Groq (console.groq.com) |

### Frontend (`frontend/.env`)
| Variável | Descrição |
|---|---|
| `VITE_API_BASE_URL` | URL base da API backend |
