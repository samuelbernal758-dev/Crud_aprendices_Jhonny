const express = require('express');
const app = express();
require('dotenv/config');

const port = process.env.PUERTO || 3000;

// Permite recibir JSON
app.use(express.json());

//utilizacion de libres multer +
const multer = require ('multer')
const almacenamiento = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, "Misimagenes/")
    }, 
    filename: (req, file, cb)=>{
        const extension = ruta.extname
        
        
         cb(null, `${Date.now}`)
    }
})

const cargar = multer({storage: almacenamiento})

// Librerías para leer y manejar archivos
const sistemaArchivo = require('fs');
const ruta = require('path');

// Importar las validaciones
const validarAprendiz = require('./Validaciones/Validaciones');
const { request } = require('http');

// Ruta del archivo listaDatos.json
const rutaArchivoJson = ruta.join(__dirname, 'listaDatos.json');



app.get('/', (req, res) => {
    res.send('API RESTFUL - CRUD Aprendices');
});


app.get('/api/aprendices', (req, res) => {

    sistemaArchivo.readFile(rutaArchivoJson, 'utf-8', (error, datos) => {

        if (error) {
            return res.status(500).json({
                Error: 'Error al leer el archivo'
            });
        }

        try {

            const listaAprendices = JSON.parse(datos);

            res.json(listaAprendices);

        } catch (error) {

            res.status(500).json({
                Error: 'Error al procesar el archivo JSON'
            });
        }
    });
});


app.get('/api/aprendices/:dni', (req, res) => {

    const dni = parseInt(req.params.dni);

    sistemaArchivo.readFile(rutaArchivoJson, 'utf-8', (error, datos) => {

        if (error) {
            return res.status(500).json({
                Error: 'Error al leer el archivo'
            });
        }

        try {

            const listaAprendices = JSON.parse(datos);

            const aprendiz = listaAprendices.find(
                aprendiz => aprendiz.dni === dni
            );

            if (!aprendiz) {
                return res.status(404).json({
                    Error: 'Aprendiz no encontrado'
                });
            }

            res.json(aprendiz);

        } catch (error) {

            res.status(500).json({
                Error: 'Error al procesar el archivo JSON'
            });
        }
    });
});


app.post('/api/aprendices', cargar.single("Imagen"), (req, res) => {

    const datoAprendiz = req.body;
    // Validar datos
    datosAprendiz.avatar = req.filename ? '/Misimagenes/$(req.file.filename)': "Sin imagen"
    const errorValidacion = validarAprendiz(datoAprendiz);

    if (errorValidacion) {
        return res.status(400).json({
            Error: errorValidacion
        });
    }

    sistemaArchivo.readFile(
        rutaArchivoJson,
        'utf-8',
        (error, datos) => {

            if (error) {
                return res.status(500).json({
                    Error: 'Error al leer el archivo'
                });
            }

            try {

                const listaAprendices = JSON.parse(datos);

                // Generar DNI automáticamente
                let nuevoDni = 1;

                if (listaAprendices.length > 0) {
                    nuevoDni =
                        Math.max(
                            ...listaAprendices.map(
                                aprendiz => aprendiz.dni || 0
                            )
                        ) + 1;
                }

                // Crear nuevo aprendiz
                const nuevoAprendiz = {
                    dni: nuevoDni,
                    ...datoAprendiz
                };

                // Agregar aprendiz
                listaAprendices.push(nuevoAprendiz);

                // Guardar archivo
                sistemaArchivo.writeFile(
                    rutaArchivoJson,
                    JSON.stringify(listaAprendices, null, 2),
                    error => {

                        if (error) {
                            return res.status(500).json({
                                Error: 'No se puede registrar el aprendiz'
                            });
                        }

                        res.status(201).json(nuevoAprendiz);
                    }
                );

            } catch (error) {

                res.status(500).json({
                    Error: 'Error al procesar el archivo JSON'
                });
            }
        }
    );
});


app.put('/api/aprendices/:dni', (req, res) => {

    const dni = parseInt(req.params.dni);
    const datosAprendiz = req.body;

    // Validar datos
    const errorValidacion = validarAprendiz(datosAprendiz);

    if (errorValidacion) {
        return res.status(400).json({
            Error: errorValidacion
        });
    }

    sistemaArchivo.readFile(
        rutaArchivoJson,
        'utf-8',
        (error, datos) => {

            if (error) {
                return res.status(500).json({
                    Error: 'Error al leer el archivo'
                });
            }

            try {

                let listaAprendices = JSON.parse(datos);

                const existeAprendiz = listaAprendices.some(
                    aprendiz => aprendiz.dni === dni
                );

                if (!existeAprendiz) {
                    return res.status(404).json({
                        Error: 'Aprendiz no encontrado'
                    });
                }

                // Modificar aprendiz
                listaAprendices = listaAprendices.map(
                    aprendiz =>
                        aprendiz.dni === dni
                            ? {
                                ...aprendiz,
                                ...datosAprendiz,
                                dni: dni
                            }
                            : aprendiz
                );

                // Guardar cambios
                sistemaArchivo.writeFile(
                    rutaArchivoJson,
                    JSON.stringify(listaAprendices, null, 2),
                    error => {

                        if (error) {
                            return res.status(500).json({
                                Error: 'No se puede actualizar el aprendiz'
                            });
                        }

                        const aprendizActualizado =
                            listaAprendices.find(
                                aprendiz => aprendiz.dni === dni
                            );

                        res.json(aprendizActualizado);
                    }
                );

            } catch (error) {

                res.status(500).json({
                    Error: 'Error al procesar el archivo JSON'
                });
            }
        }
    );
});

app.delete('/api/aprendices/:dni', (req, res) => {

    const dni = parseInt(req.params.dni);

    sistemaArchivo.readFile(
        rutaArchivoJson,
        'utf-8',
        (error, datos) => {

            if (error) {
                return res.status(500).json({
                    Error: 'Error al leer el archivo'
                });
            }

            try {

                let listaAprendices = JSON.parse(datos);

                const existeAprendiz = listaAprendices.some(
                    aprendiz => aprendiz.dni === dni
                );

                if (!existeAprendiz) {
                    return res.status(404).json({
                        Error: 'Aprendiz no encontrado'
                    });
                }

                // Eliminar aprendiz
                listaAprendices = listaAprendices.filter(
                    aprendiz => aprendiz.dni !== dni
                );

                // Guardar archivo actualizado
                sistemaArchivo.writeFile(
                    rutaArchivoJson,
                    JSON.stringify(listaAprendices, null, 2),
                    error => {

                        if (error) {
                            return res.status(500).json({
                                Error: 'No se puede eliminar el aprendiz'
                            });
                        }

                        res.json({
                            mensaje: 'Aprendiz eliminado correctamente'
                        });
                    }
                );

            } catch (error) {

                res.status(500).json({
                    Error: 'Error al procesar el archivo JSON'
                });
            }
        }
    );
});


app.listen(port, () => {
    console.log(`SERVER: http://localhost:${port}`);
})