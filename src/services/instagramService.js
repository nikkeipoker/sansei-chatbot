const axios = require('axios');
async function sendMessage(recipientId, text) {
      try {
                const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.IG_TOKEN}`;
                await axios.post(url, {
                              recipient: { id: recipientId },
                              message: { text: text }
                }, {
                              headers: { 'Content-Type': 'application/json' }
                });
                console.log(`[InstagramService] Mensaje enviado al usuario ${recipientId}`);
      } catch (error) {
                console.error(`[InstagramService] Error enviando mensaje a ${recipientId}:`, error.response ? error.response.data : error.message);
      }
}
module.exports = { sendMessage };
