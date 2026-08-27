const express = require('express');
const app = express();
require('dotenv/config');

const port = process.env.PUERTO || 3000;

// Permite recibir JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//endpoint
app.post("/datos.json", (req, res)=>{
    const datosRecibidos = req.body
    //Validamos si los datos son recibidos 
    if (datosRecibidos){
        res.json({mensaje: "Datos recibidos correctamente"})
    }
    res.status(500).json({Mensaje: "No se recibieron los datos"});
})
app.post("/formulario", (req, res)=>{
    const datos = req.body
    //
    res.json({datos: datos})
})
app.listen(port, () => {
    console.log(`SERVER: http://localhost:${port}`);
});