/**
 * Script de exemplo para enviar atualizações de status via Webhook
 * Uso: node send-webhook.mjs <nome_do_proxy> <status: online|offline>
 */

import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'RUAN_WEBHOOK_SECRET_2024';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Uso: node send-webhook.mjs <nome_do_proxy> <status: online|offline>');
  process.exit(1);
}

const [name, status] = args;

async function sendWebhook() {
  const url = `${API_URL}/api/trpc/webhook.proxyStatusUpdate?batch=1`;
  
  const payload = {
    "0": {
      "json": {
        "name": name,
        "status": status,
        "secret": WEBHOOK_SECRET
      }
    }
  };

  console.log(`🚀 Enviando atualização para ${name} -> ${status}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook enviado com sucesso!');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Erro ao enviar webhook:', response.status, response.statusText);
      console.error(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('💥 Erro de conexão:', error.message);
  }
}

sendWebhook();
