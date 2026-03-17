const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../../clientes.csv');
function initDatabase() {
      if (!fs.existsSync(dbPath)) {
                fs.writeFileSync(dbPath, 'Telefono,Nombre,Apellido,Email,Fecha_Registro\n', 'utf8');
      }
}
function saveCustomer(phone, name, lastName, email) {
      try {
                const date = new Date().toISOString().split('T')[0];
                const csvLine = `${phone},${name},${lastName},${email},${date}\n`;
                fs.appendFileSync(dbPath, csvLine, 'utf8');
      } catch (err) { console.error(err); }
}
module.exports = { initDatabase, saveCustomer };
