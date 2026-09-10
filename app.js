const express = require('express');
const registroMiddleware = require('./middleware/registroMiddleware')
const manejadorErrores = require('./middleware/manejadorErrores')
const autenticarToken = require('./middleware/autenticarToken')
const jswtoken = require("jsonwebtoken")
const app = express();
require('dotenv/config');
const port = process.env.PORT || 3000;

app.use(express.json());
    app.use(express.urlencoded({extended:true}))

const multer = require('multer')
const almacenamiento = multer.diskStorage({
    destination: (request, file, cb) =>{},
    filename: {}
})
app.use(registroMiddleware)

app.use ((req, res, next) => {
    const tiempoMilisegundos = Date.now()
    console.log(`Tiempo: ${tiempoMilisegundos}`)
    next()
})

// Librerías para leer y manejar archivos
const sistemaArchivo = require('fs');
const ruta = require('path');

// Importar las validaciones
const validarAprendiz = require('./Validaciones/Validaciones');
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
                Error: 'Error al leer el archivo'});
        }

        try {
            const listaAprendices = JSON.parse(datos);
            const aprendiz = listaAprendices.find(
                aprendiz => aprendiz.dni === dni);

            if (!aprendiz) {
                return res.status(404).json({
                    Error: 'Aprendiz no encontrado'});
            }
            res.json(aprendiz);

        } catch (error) {
            res.status(500).json({
                Error: 'Error al procesar el archivo JSON'
            });
        }
    });
});

app.post('/api/aprendices', (req, res) => {

    const datoAprendiz = req.body;
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
                let nuevoDni = 1;
                if (listaAprendices.length > 0) {
                    nuevoDni =
                        Math.max(
                            ...listaAprendices.map(
                                aprendiz => aprendiz.dni || 0)) + 1;
                }

                const nuevoAprendiz = {
                    dni: nuevoDni,
                    ...datoAprendiz
                };
                listaAprendices.push(nuevoAprendiz);

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
                listaAprendices = listaAprendices.filter(
                    aprendiz => aprendiz.dni !== dni
                );
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

app.get("/error", (req, res, next) => {
    next(new Error ("Error provocado"))
})

app.get("/rutaProtegida", autenticarToken , (req, res) => {
    res.json({mensaje: "Este es una ruta protegida"})
})

app.post("/login", (req, res) => {
    const { usuario, clave } = req.body
    const usuariobd = {
        "usuario": "jhonny",
        "clave": "abc123"   
    }

    if (usuario !== usuariobd.usuario || clave !== usuariobd.clave) {
        return res.json({ mensaje: "Usuario y/o clave incorrectos." })
    }
    const token = jswtoken.sign(
        { usuario: usuario }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1h" } 
    )

    res.json({ token }) 
})


app.use(manejadorErrores)

app.listen(port, () => {
    console.log(`SERVER: http://localhost:${port}`);
});