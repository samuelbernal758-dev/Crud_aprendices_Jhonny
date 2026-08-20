const express = require('express');
const app = express();
require('dotenv/config');
const port = process.env.PORT || 3030;

// Librería para leer Archivos
const sistemaArchivo = require('fs');
const ruta = require('path');

// generar una ruta raiz para el archivo aprendices
const rutaArchivoJson = ruta.join(__dirname, 'ListaDatos.json');

app.use(express.json());

app.get("/", (_, res) => {
    res.send('API RESTFUL - CRUD Aprendices');
});

// Ruta para obtener todos los aprendices
app.get("/aprendices", (req, res) => {
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            res.status(500).json({ Error: "Error al leer el archivo, conexion bd" });
        }
        const ListaAprendices = JSON.parse(datos);
        res.json(ListaAprendices);
    });
});

app.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto: http://localhost:${port}`);
});
