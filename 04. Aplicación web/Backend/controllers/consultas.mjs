//SE IMPORTA EL POOL DE LA BASE DE DATOS MYSQL
import { pool } from '../db_conection/db.mjs'

//SE IMPORTA bcrypt PARA HASHEAR LAS CONTRASEÑAS:
import { hash, compare } from 'bcryptjs';

//SE IMPORTA JWT PARA CREAR EL TOKEN DE INICIO DE SESIÓN
import jwt from "jsonwebtoken";

//SE IMPORTA DOT ENV PARA CARGAR LA VARIABLE:
import dotenv from "dotenv";
dotenv.config(); // Carga las variables de entorno

//SE GUARDA LA SECRET_KEY QUE ES LA CLAVE PARA LOS JSON WEB TOKEN:
const SECRET_KEY = process.env.SECRET_KEY;

//FUNCIONES UTILIZADAS DENTRO DE LAS FUNCIONES PRINCIPALES:

//FUNCIÓN QUE PARSEA A ENTERO EL REGISTRO ACADÉMICO DE LOS ESTUIDANTES, SI ESTE CONTIENE ALGUN CARACTER QUE NO SEA UN DÍGITO SE RETORNA NaN
const parseCarnet = (carnet) => {
    // Verificar que el string solo contiene dígitos (sin letras ni caracteres especiales)
    if (/^\d+$/.test(carnet)) {
        return Number(carnet); // Convertir a número
    } else {
        return NaN; // Devolver NaN si contiene letras u otros caracteres
    }
};

//FUNCIÓN QUE VERIFICA SI UN CORREO CUMPLE CON LA SINTAXIS DE UN CORREO:
const validarCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
};

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

    try {
        //SE OBTIENE LA INFORMACIÓN DEL USUARIO
        let { registro, nombres, apellidos, correo, contrasenia } = req.body
        
        //SE PARSEA EL REGISTRO ACADÉMICO A ENTERO:
        let nRegistro = parseCarnet(registro);

        //SE VERIFICA QUE EL USUARIO SEA ENTERO
        if (Number.isInteger(nRegistro) === true && validarCorreo(correo) === true){
            //SE HASHEA LA PASSWORD DEL USUARIO PARA ENVIARLA A LA BASE DE DATOS:
            const saltRounds = 10;
            const hashedPassword = await hash(contrasenia, saltRounds);

            //SE ENVÍAN LOS DATOS A LA BASE DE DATOS:
            try {
                const result = await pool.query('INSERT INTO usuario (r_academico, nombres, apellidos, contrasenia, correo) values (?, ?, ?, ?, ?)', [nRegistro, nombres, apellidos, hashedPassword, correo])
                return res.status(200).json({status: 200, message: "Usuario creado con éxito"})
            } catch (error) {
                return res.status(500).json({status: 500, message: `Ocurrió un error interno al crear el usuario ${error}`})
            }
        }
        return res.status(400).json({status: 400, message: "No se puedo crear el usuario"})
        
    } catch (error) {
        return res.status(500).json({status: 500, message: "No se pudo crear el usuario en la base de datos", error: error})
    }

        //EL JSON DE ENTRADA DEBERÍA SER COMO EL SIGUIENTE:
    /*{
        "registro": 20202020,
        "nombres": "1NOMBRE 2NOMBRE",
        "apellidos": "1APELLIDO 2APELLIDO",
        "correo": "correo@gmail.com",
        "contrasenia": "CONTRASEÑA"
    }*/

}

export async function Login (req, res) {
    try {
        //PRIMERO SE DESESTRUCTURA EL CUERPO DE LA PETICIÓN:
        const { carnet, contrasenia } = req.params
        //SI NO SE ENVIÓ ALGUN DATO, SE RETORNA UN STATUS 400
        if (!carnet || !contrasenia) {
            return res.status(400).json({status: 400, message: "El carné o la contraseña no fueron proporcionados. Rellene todos los campos"})
        }

        try {
            //SI SE ENVIARON CARNET Y CONTRASEÑA, SE REALIZA LA QUERY
            const [rows] = await pool.query('SELECT * FROM usuario WHERE usuario.r_academico = ?', [carnet])
            //SI EL ARRAY TIENE AL MENOS UN DATO, SE COMPRUEBA SI LA CONTRASEÑA ES CORRECTA
            if(rows.length !== 0){
                let hashedPassword = rows[0].contrasenia
                let coincidencia = await compare(contrasenia, hashedPassword)
                const primerNombre = rows[0].nombres.split(" ")[0]
                const primerApellido = rows[0].apellidos.split(" ")[0];

                if (coincidencia){
                    //SE GENERA EL JSON WEB TOKEN
                    const token = jwt.sign(
                        { id: rows[0].r_academico, nombre: `${primerNombre} ${primerApellido}` }, // Payload
                        SECRET_KEY, // Clave secreta
                        { expiresIn: "1h" } // Expiración del token
                    );
                    return res.status(200).json({status: 200, message: "Se encontró el usuario", user: rows[0].r_academico, nombre: `${primerNombre} ${primerApellido}`, token})
                } 
                else return res.status(400).json({status: 400, message: "El carné o contraseña no son correctos"})
            }
            //SE RETORNA UN STATUS 400 SI LA BASE DE DATOS NO RETORNÓ NADA
            return res.status(400).json({status: 400, message: "No se encontró ningun usuario con este registro académico"})
        } catch (error) {
            return res.status(500).json({status: 500, message: "Ocurrió un error en la base de datos al realizar la query"})
        }
    } catch (error) {
        return res.status(500).json({status: 500, message: "Ocurrió un error interno al iniciar sesión. Intente de nuevo"})
    }

    /*JSON DE ENTRADA CON LOS DATOS DEL USUARIO: 
    {
        carnet: 202XXXXXX
        contrasenia: "contraseña del usuario"
    }
    */
    
}