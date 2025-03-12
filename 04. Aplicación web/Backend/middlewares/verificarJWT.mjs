//SE IMPORTA EL JWT Y TAMBIÉN DOTENV PARA USAR LA VARIABLE DE ENTORNO
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//SE GUARDA LA CLAVE SECRETA DEL JWT
const SECRET_KEY = process.env.SECRET_KEY;

//SE CREA UN MIDDLEWARE, ESTA FUNCIÓN COMPROBARÁ QUE EL TOKEN SIGA ACTIVO O SEA VÁLIDO
//SI ES VÁLIDO, LA SIGUIENTE FUNCIÓN SE EJECUTARÁ
//LA FUNCIÓN QUE SE EJECUTARÁ SERÁ LA QUE SE DECLARE EN EL ARCHIVO DE routes.mjs
//Y LA FUNCIÓN SE DEFINE EN consultas.mjs
export function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ status: 403, message: "Acceso denegado. Token no proporcionado." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        //SE GUARDA EL USUARIO AUNTENTICADO EN LA REQUEST req
        req.usuario = decoded;
        //SE PASA A LA SIGUIENTE FUNCIÓN
        next();
    } catch (error) {
        return res.status(401).json({ status: 401, message: "Token inválido o expirado" });
    }
}