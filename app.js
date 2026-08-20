import express from 'express'
import 'dotenv/config';
const app = express();
const port = process.env.PORT || 3030;

app.use(express.json());

app.get("/", (_, res)=>{
    res.send('Nuevo Proyecto en express')
})

app.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto: http://localhost:${port}`)
});
