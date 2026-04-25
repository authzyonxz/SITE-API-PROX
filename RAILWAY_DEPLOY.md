# 🚀 Deploy AUTH PROXY no Railway

## Pré-requisitos
- Conta no Railway (railway.app)
- Git instalado localmente

## Passo 1: Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub" (ou upload do ZIP)
4. Conecte seu repositório GitHub

## Passo 2: Configurar Banco de Dados

1. No painel do Railway, clique em "Add Service"
2. Selecione "PostgreSQL"
3. Aguarde a criação (Railway criará automaticamente a variável `DATABASE_URL`)

## Passo 3: Configurar Variáveis de Ambiente

No Railway, vá para **Variables** e adicione:

```
# Obrigatórias
DATABASE_URL=postgresql://... (criada automaticamente pelo Railway)
JWT_SECRET=sua_chave_secreta_aqui_minimo_32_caracteres
NODE_ENV=production

# Opcionais (se usar OAuth Manus)
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# Para API externa de proxy
PROXY_API_URL=http://212.227.7.153:9945
PROXY_MASTER_KEY=RUANKEY367382F6
```

## Passo 4: Configurar Build & Start

Railway detectará automaticamente `package.json`. Certifique-se de que os scripts estão corretos:

```json
{
  "scripts": {
    "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

## Passo 5: Deploy

1. Faça push do código para GitHub
2. Railway fará deploy automaticamente
3. Acesse a URL gerada (ex: `auth-proxy-production.up.railway.app`)

## ⚠️ Importante: Migração do Banco de Dados

Após o primeiro deploy, você precisa rodar as migrations:

### Opção 1: Via Railway Shell
```bash
# No painel do Railway, abra o Shell do serviço
cd /app
pnpm drizzle-kit migrate
```

### Opção 2: Via Script Local
```bash
# Localmente, com DATABASE_URL do Railway
DATABASE_URL="postgresql://..." pnpm drizzle-kit migrate
```

## 🔐 Credenciais Padrão

Após deploy, acesse com:
- **Usuário**: `Ruan`
- **Senha**: `Ruan00`

## 📝 Notas

- O banco de dados será criado automaticamente na primeira execução
- O admin padrão (Ruan/Ruan00) é criado via seed automático
- Railway fornece 5GB de armazenamento gratuito para PostgreSQL
- Certifique-se de que `JWT_SECRET` é uma string forte e única

## 🆘 Troubleshooting

### Erro: "DATABASE_URL not found"
- Verifique se PostgreSQL foi adicionado como serviço
- Clique em "Connect" para gerar a variável automaticamente

### Erro: "Port already in use"
- Railway gerencia portas automaticamente, não defina PORT manualmente

### Erro: "Migration failed"
- Verifique se o banco de dados está rodando
- Tente rodar migrations novamente via Shell

## 📞 Suporte

Para dúvidas sobre Railway: https://docs.railway.app
