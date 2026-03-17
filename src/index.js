require('dotenv').config();
const express = require('express');
const webhookRoutes = require('./routes/webhookRoutes');
const database = require('./logic/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main webhook route
app.use('/webhook', webhookRoutes);

// Database init
database.initDatabase();

// Healthcheck
app.get('/', (req, res) => {
    res.send('Sansei Bot Server is running!');
    });

    app.listen(PORT, () => {
        console.log(` Servidor ejecutandose en el puerto ${PORT}`);
        });
