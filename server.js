const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');

// Carga de variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'trailerflix_grupo4')));


// Manejo de rutas inexistentes
app.use((req, res) => {
    res.json({ error: 404, message: 'No se encuentra la ruta o el recurso solicitado.'});
});

// Configuración del servidor
app.listen(PORT, () => {
    console.log('Servidor iniciando en http://localhost:' + PORT);
});