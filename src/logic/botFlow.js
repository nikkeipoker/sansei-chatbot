const whatsappService = require('../services/whatsappService');
const instagramService = require('../services/instagramService');
const stateManager = require('./stateManager');
const database = require('./database');

const MENU_LINK = "https://menu.fu.do/sansei";
const HORARIOS = "\u{1F363} *Horarios del sal\u00f3n:*\n\u25AB\uFE0F Mediod\u00eda: Martes a S\u00e1bados 11:30 a 15:30\n\u25AB\uFE0F Noche: Viernes y S\u00e1bados 19:30 a 23:30";

async function handleMessage(userId, message, platform) {
        const text = message.trim().toLowerCase();
        const state = stateManager.getUserState(userId);
        let responseText = "";

    if (state.step === 'START') {
                if (text === '1') {
                                responseText = `Aqu\u00ed tienes nuestro men\u00fa digital:\n${MENU_LINK}\n\nEscr\u00edbeme "Hola" en cualquier momento para volver a ver las opciones!`;
                } else if (text === '2') {
                                stateManager.updateUserState(userId, 'BOOKING_DETAILS');
                                responseText = `\u00a1Excelente! Para tomar tu reserva de forma m\u00e1s \u00e1gil, por favor env\u00edanos en *un solo mensaje*:\n\n- Nombre y Apellido\n- Email\n- D\u00eda\n- Hora\n- Cantidad de personas`;
                } else if (text === '3') {
                                responseText = `Para realizar tu pedido por favor ingresa al siguiente enlace, all\u00ed podr\u00e1s elegir los productos y el horario de retiro:\n\n> ${MENU_LINK}\n\nO env\u00edanos "Hola" para volver al men\u00fa principal.`;
                } else {
                                responseText = `\u00a1Hola \u{1F44B}! \u00a1Muchas gracias por comunicarte con Sansei!\n\n${HORARIOS}\n\nPor favor, responde con un n\u00famero para elegir una opci\u00f3n:\n\n1\uFE0F\u20E3 Ver Men\u00fa\n2\uFE0F\u20E3 Realizar una Reserva (Sal\u00f3n)\n3\uFE0F\u20E3 Pedir Takeaway (Para retirar)`;
                }
    } else if (state.step === 'BOOKING_DETAILS') {
                stateManager.clearUserState(userId);
                const lines = message.split('\n').map(l => l.trim()).filter(l => l.length > 0);

            let nombre = 'No especificado';
                let apellido = '';
                let email = 'No especificado';

            if (lines.length >= 2) {
                            const emailMatch = message.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/);
                            email = emailMatch ? emailMatch[0] : lines[1];

                    const nameParts = lines[0].replace(/-/g, '').trim().split(' ');
                            nombre = nameParts[0] || lines[0];
                            apellido = nameParts.slice(1).join(' ');
            }

            const plainPhone = userId.replace('whatsapp:', '').replace('+', '');
                database.saveCustomer(plainPhone, nombre, apellido, email);

            responseText = `[OK] *Solicitud de Reserva Registrada!*\n\nDetalles recibidos:\n${message}\n\nEn breve uno de nuestros encargados confirmar\u00e1 la disponibilidad respondi\u00e9ndote por este medio. \u00a1Muchas gracias!`;
    }

    if (platform === 'whatsapp') {
                await whatsappService.sendMessage(userId, responseText);
    } else if (platform === 'instagram') {
                await instagramService.sendMessage(userId, responseText);
    }
}

module.exports = { handleMessage };
