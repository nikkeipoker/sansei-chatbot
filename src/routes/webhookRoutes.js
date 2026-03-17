const express = require('express');
const router = express.Router();
const botFlow = require('../logic/botFlow');

// --- VERIFICACION DEL WEBHOOK (GET) ---
router.get('/', (req, res) => {
      const verify_token = process.env.VERIFY_TOKEN;
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

               if (mode && token) {
                         if (mode === 'subscribe' && token === verify_token) {
                                       console.log('WEBHOOK_VERIFIED');
                                       res.status(200).send(challenge);
                         } else {
                                       res.sendStatus(403);
                         }
               } else {
                         res.sendStatus(400);
               }
});

// --- RECEPCION DE MENSAJES (POST) ---
router.post('/', async (req, res) => {
      try {
                if (req.body && req.body.SmsMessageSid) {
                              const from = req.body.From;
                              const msgBody = req.body.Body;
                              console.log(`[Twilio WhatsApp] Mensaje de ${from}: ${msgBody}`);
                              await botFlow.handleMessage(from, msgBody, 'whatsapp');
                              res.setHeader('Content-Type', 'text/xml');
                              return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
                }
                const body = req.body;
                if (body && body.object === 'instagram') {
                              if (body.entry && body.entry[0].messaging && body.entry[0].messaging[0]) {
                                                const messageEvent = body.entry[0].messaging[0];
                                                const senderId = messageEvent.sender.id;
                                                if (messageEvent.message && messageEvent.message.text) {
                                                                      const msgBody = messageEvent.message.text;
                                                                      console.log(`[Instagram] Mensaje de ${senderId}: ${msgBody}`);
                                                                      await botFlow.handleMessage(senderId, msgBody, 'instagram');
                                                }
                              }
                              return res.sendStatus(200);
                }
                res.sendStatus(200);
      } catch (error) {
                console.error("Error procesando webhook:", error);
                res.status(500).send(error.stack || error.message);
      }
});
module.exports = router;
