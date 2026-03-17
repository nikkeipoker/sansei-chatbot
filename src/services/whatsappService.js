const twilio = require('twilio');
async function sendMessage(to, text) {
      try {
                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
                if (!accountSid || !authToken) {
                              console.log(`[WhatsAppService] Simulando envio a ${to} (Faltan credenciales de Twilio). Mensaje:\n${text}`);
                              return;
                }
                const client = twilio(accountSid, authToken);
                const toFormated = to.startsWith('whatsapp:') ? to : `whatsapp:+${to}`;
                await client.messages.create({
                              body: text,
                              from: fromNumber,
                              to: toFormated
                });
                console.log(`[WhatsAppService] Mensaje enviado a ${toFormated}`);
      } catch (error) {
                console.error(`[WhatsAppService] Error enviando mensaje a ${to}:`, error.message);
      }
}
module.exports = { sendMessage };
