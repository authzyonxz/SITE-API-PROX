# ⚓ Guia de Integração via Webhook

Para reduzir a carga no servidor e evitar o uso de polling (consultas repetitivas), implementamos um sistema de Webhooks para atualização de status dos proxies.

## Endpoint

**URL:** `https://SUA-API.up.railway.app/api/trpc/webhook.proxyStatusUpdate?batch=1`  
**Método:** `POST`

## Estrutura do Payload (JSON)

O sistema utiliza o protocolo tRPC. O corpo da requisição deve seguir este formato:

```json
{
  "0": {
    "json": {
      "name": "NOME_DO_PROXY",
      "status": "online",
      "secret": "RUAN_WEBHOOK_SECRET_2024"
    }
  }
}
```

### Campos:
- `name`: O nome identificador do proxy (ex: "Proxy Brasil 01").
- `status`: Deve ser exatamente `online` ou `offline`.
- `secret`: Chave de segurança para autorizar a requisição.

## Exemplo com cURL

```bash
curl -X POST https://SUA-API.up.railway.app/api/trpc/webhook.proxyStatusUpdate?batch=1 \
-H "Content-Type: application/json" \
-d '{
  "0": {
    "json": {
      "name": "Proxy-Premium",
      "status": "online",
      "secret": "RUAN_WEBHOOK_SECRET_2024"
    }
  }
}'
```

## Automação com Node.js

Você pode encontrar um script de exemplo pronto para uso em `scripts/send-webhook.mjs`.

Para rodar:
```bash
export API_URL="https://sua-api.railway.app"
node scripts/send-webhook.mjs "Proxy-Teste" "online"
```

## Benefícios
- **Tempo Real**: O status no painel muda instantaneamente.
- **Baixo Consumo**: O servidor não precisa processar milhares de requisições de "pergunta" por minuto.
- **Estabilidade**: Evita travamentos por excesso de tráfego (100k requests).
