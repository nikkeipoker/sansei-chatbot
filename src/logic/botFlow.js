const whatsappService = require('../services/whatsappService');
const instagramService = require('../services/instagramService');
const stateManager = require('./stateManager');
const database = require('./database');
const MENU_LINK = "https://menu.fu.do/sansei";
const HORARIOS = "*Horarios del salon:*\n- Mediodia: Martes a Sabados 11:30 a 15:30\n- Noche: Viernes y Sabados 19:30 a 23:30";
async function handleMessage(userId, message, platform) {
    const text = message.trim().toLowerCase();
    const state = stateManager.getUserState(userId);
    let responseText = "";
    if (state.step === 'START') {
        if (text === '1') {
            responseText = `Aqui tienes nuestro menu digital: ${MENU_LINK}\n\nEscribeme "Hola" en cualquier momento para volver a ver las opciones!`;
        } else if (text === '2') {
            stateManager.updateUserState(userId, 'BOOKING_DETAILS');
            responseText = `Excelente! Para tomar tu reserva de forma mas agil, por favor envianos en *un solo mensaje*:\n\n- Nombre y Apellido\n- Email\n- Dia\n- Hora\n- Cantidad de personas`;
        } else if (text === '3') {
            responseText = `Para realizar tu pedido por favor ingresa al siguiente enlace, alli podras elegir los productos y el horario de retiro:\n\n> ${MENU_LINK}\n\nO envianos "Hola" para volver al menu principal.`;
        } else {
            responseText = `Hola! Muchas gracias por comunicarte con Sansei!\n\n${HORARIOS}\n\nPor favor, responde con un *numero* para elegir una opcion:\n\n*1* Ver Menu\n*2* Realizar una Reserva (Salon)\n*3* Pedir Takeaway (Para retirar)`;
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
        responseText = `[OK] *Solicitud de Reserva Registrada!*\n\nDetalles recibidos:\n${message}\n\nEn breve uno de nuestros encargados confirmara la disponibilidad respondiendote por este medio. Muchas gracias!`;
    }
    if (platform === 'whatsapp') await whatsappService.sendMessage(userId, responseText);
    else if (platform === 'instagram') await instagramService.sendMessage(userId, responseText);
}
module.exports = { handleMessage };
