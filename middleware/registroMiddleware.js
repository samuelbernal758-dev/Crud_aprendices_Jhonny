const registroMiddleware = (req, res, next)=>{
    const fecha = new Date().toISOString()
    console.log(`[Historial Repeticiones]: ${fecha} , ${req.method}. ${req.url}, ${req.ip}`)
    const tiempoMilisegundos = Date.now();
    //Escuchamos el evento 'fin' para saber cuando terminamos la respuesta
    res.on('finish', () =>{
        const duracion = Date.now() - tiempoMilisegundos;
        console.log(fecha, 'respuesta', res.statusCode, duracion + 'ms');
    });
    next()
}

module.exports = registroMiddleware