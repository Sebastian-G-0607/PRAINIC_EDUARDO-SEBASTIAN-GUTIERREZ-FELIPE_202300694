//SE IMPORTA EL POOL DE LA BASE DE DATOS MYSQL
import { pool } from './db.mjs'

//SE IMPORTA bcrypt PARA HASHEAR LAS CONTRASEÑAS:
const bcrypt = require("bcrypt");

//OBTIENE TODOS LOS USUARIOS DE LA BASE DE DATOS
export async function getCursos (req, res) {
    try {
        const response = await pool.query('SELECT * FROM curso')
        return res.json(response[0]);
    } catch (error) {
        return res.status(500).json({"error": `Server error ${error}`})
    }
}

//REGISTRA A UN NUEVO USUARIO:
export async function registrarUsuario (req, res) {
    //EL JSON DE ENTRADA DEBERÍA SER COMO EL SIGUIENTE:
    /*{
        "registro": 20202020,
        "nombres": "1NOMBRE 2NOMBRE",
        "apellidos": "1APELLIDO 2APELLIDO",
        "correo": "correo@gmail.com",
        "contrasenia": "CONTRASEÑA"
    }*/

    let infoUser = req.body

    //SE HASHEA LA PASSWORD DEL USUARIO PARA ENVIARLA A LA BASE DE DATOS:
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(infoUser.contrasenia, saltRounds);
}