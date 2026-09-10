const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
    const token = req.header("autenticacion")?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Acceso denegado, no provee token." });
    }

    jwt.verify(token, process.env.JWT_SECRET || "frasesecreta", (error, usuario) => {
        if (error) {
            return res.status(403).json({ error: "Token Inválido" });
        }
        
        req.usuario = usuario;
        next(); 
    });
}

module.exports = autenticarToken