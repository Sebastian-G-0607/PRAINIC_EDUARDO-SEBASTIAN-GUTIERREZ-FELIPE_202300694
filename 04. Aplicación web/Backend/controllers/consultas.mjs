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
        const [response] = await pool.query('SELECT id, nombre, seccion FROM curso')
        return res.json(response);
    } catch (error) {
        return res.status(500).json({"error": `Server error ${error}`})
    }
}

export async function getCatedraticos (req, res) {
    try {
        const [response] = await pool.query('SELECT * FROM catedratico ORDER BY nombre ASC');
        return res.json(response);
    } catch (error) {
        return res.status(500).json({"error": `Server error ${error}`})
    }
}

export async function getPublicaciones (req, res) {
    try {
        const [response] = await pool.query('SELECT p.id, u.nombres, u.apellidos, p.tipo, p.titulo, p.mensaje, p.fecha FROM publicacion p JOIN usuario u on u.r_academico = p.id_usuario ORDER BY p.fecha DESC;');
        return res.json(response);
    } catch (error) {
        return res.status(500).json({"error": `Server error ${error}`})
    }
}

//FUNCIÓN QUE RETORNA LOS DATOS DE UN USUARIO:
export async function getUsuario (req, res) {
    try {
        let user = req.params.id_user;
        let [response] = await pool.query('SELECT nombres, apellidos, contrasenia, correo FROM usuario WHERE r_academico = ?', [user])
        return res.json(response);
    } catch (error) {
        return res.status(500).json({"message": `Server error ${error}`})
    }
}

//FUNCIÓN QUE RETORNA LOS CURSOS APROBADOS DE UN USUARIO
export async function getCursosAprobados (req, res) {
    try {
        let user = req.params.id_user;
        let [response] = await pool.query('SELECT id_curso FROM usuario_cursos WHERE id_usuario = ?', [user])
        return res.json(response);
    } catch (error) {
        return res.status(500).json({"message": `Server error ${error}`})        
    }
}

//FUNCIÓN QUE ACTUALIZA UN USUARIO:
export async function actualizarUsuario(req, res){
    //EN LA RUTA SE LE PASA EL REGISTRO ACADEMICO Y EN EL JSON LOS OTROS DATOS: 
    try {
        let user = req.params.id_user;
        //SE OBTIENE LA CONTRASEÑA ANTIGUA
        const [pass] = await pool.query('SELECT contrasenia FROM usuario WHERE r_academico = ?', [user])
        const password = pass[0].contrasenia;
        let {nombres, apellidos, contrasenia, correo} = req.body;
        if(!nombres || !apellidos || !contrasenia || !correo){
            return res.status(403).json({"message": `Todos los campos deben estar llenos`})      
        }
        //SE COMPARA SI LA CONTRASEÑA ES IGUAL
        if(contrasenia === password){
            let [response] = await pool.query('UPDATE usuario SET nombres = ?, apellidos = ?, correo = ? WHERE r_academico = ?', [nombres, apellidos, correo, user])
            return res.json({message: "El usuario fue actualizado con éxito"});
        }
        //SI NO ES IGUAL, SE GUARDA EL HASH DE LA NUEVA CONTRASEÑA:
        else{
            try {
                //PRIMERO, SE HASHEA LA NUEVA PASSWORD
                const saltRounds = 10;
                const hashedPassword = await hash(contrasenia, saltRounds);

                let [response] = await pool.query('UPDATE usuario SET nombres = ?, apellidos = ?, contrasenia = ?, correo = ? WHERE r_academico = ?', [nombres, apellidos, hashedPassword, correo, user])
                return res.json({message: "El usuario fue actualizado con éxito"});
            } catch (error) {
                return res.status(500).json({status: 500, message: "Ocurrió un error al intentar actualizar el usuario"});
            }
            
        }
    } catch (error) {
        return res.status(500).json({"message": `Server error ${error}`})        
    }
}

//FUNCIÓN QUE REESTABLECE LA CONTRASEÑA DE UN USUARIO:
export async function recuperarContrasenia (req, res) {
    try {
        //SE OBTIENEN LAS VARIABLES DE LA PETICIÓN
        const id_user = req.params.id_user;
        const {correo, contrasenia} = req.body;

        //SE REALIZA PRIMERO LA PETICIÓN PARA SABER SI EXISTE USUARIO CON ESE CARNET
        let [response] = await pool.query('SELECT * FROM usuario WHERE r_academico = ?', [id_user])

        //SI NO HAY DATOS, SE RETORNA UN STATUS 400
        if (response.length === 0) {
            return res.status(400).json({message: "No se encontró el usuario. Intente de nuevo", status: 400})
        }
        //SI HAY DATOS, SE COMPRUEBA QUE EL CORREO SEA CORRECTO
        else {
            if(correo !== response[0].correo){
                return res.status(400).json({message: "No se encontró el usuario. Verifique de nuevo los datos", status: 400})
            }
            else{
                //PRIMERO, SE HASHEA LA NUEVA PASSWORD
                const saltRounds = 10;
                const hashedPassword = await hash(contrasenia, saltRounds);
                //SE REALIZA LA PETICIÓN A LA BBDD
                let [responsePassword] = await pool.query('UPDATE usuario SET contrasenia = ? WHERE r_academico = ?', [hashedPassword, id_user])
                return res.status(200).json({message: "Se reestableció la contraseña correctamente", status: 200})
            }
        }
    } catch (error) {
        return res.status(500).json({"message": `Server error ${error}`, status: 500})        
    }
}

//FUNCION QUE APRUEBA EL CURSO DE UN USUARIO:
export async function aprobarCurso(req, res) {
    /*JSON DE ENTRADA:
    {
        id_curso: ##
    }*/
    try {
        let user = req.params.id_user;
        let {id_curso} = req.body;
        let [response] = await pool.query('INSERT INTO usuario_cursos (id_curso, id_usuario) VALUES (?, ?)', [id_curso, user]);
        return res.json({message: `El curso fue marcado como aprobado`});
    } catch (error) {
        return res.status(500).json({"message": `Error al marcar el curso como aprobado ${error}`})        

    }
}
//FUNCIÓN QUE QUITA EL CURSO APROBADO DE UN USUARIO:
export async function quitarCurso(req, res){
    /*JSON DE ENTRADA:
    {
        id_curso: ##
    }*/
    try {
        let user = req.params.id_user;
        let {id_curso} = req.body;
        let [response] = await pool.query('DELETE FROM usuario_cursos WHERE id_curso = ? AND id_usuario = ?', [id_curso, user])
        return res.json({message: `El curso fue quitado como aprobado`})
    } catch (error) {
        return res.status(500).json({"message": `Error al quitar el curso como aprobado ${error}`});        
    }
}

//FUNCIÓN QUE RETORNA UN USUARIO Y SUS CURSOS APROBADOS:
export async function verOtro (req, res){
    try {
        const id_user = req.params.id_user;
            let [response] = await pool.query('SELECT r_academico, nombres, apellidos, correo FROM usuario WHERE r_academico = ?', [id_user])
            let [response2] = await pool.query('SELECT c.nombre, c.seccion FROM usuario_cursos uc JOIN curso c ON uc.id_usuario = ? AND c.id = uc.id_curso;', [id_user])
            return res.json({personal: response, cursos: response2})
    } catch (error) {
        return res.status(500).json({"message": `Error al visitar el perfil del usuario ${error}`});    
    }
    
}

//FUNCIÓN QUE PUBLICA UN COMENTARIO EN UNA PUBLICACIÓN:
export async function publicarComentario(req, res) {
    try {
        //SE OBTIENE LA INFORMACIÓN DE LA PETICIÓN:
        const id_publicacion = req.params.id_publicacion;
        const {id_user, mensaje} = req.body;
        
        //SE ENVÍA LA PETICIÓN A LA BBDD
        try {
            let [response] = await pool.query('INSERT INTO publicacion_comentario (id_publicacion, id_usuario, mensaje) VALUES (?, ?, ?);', [id_publicacion, id_user, mensaje])
            return res.status(200).json({"message": `El comentario fue publicado con éxito`, status: 200});
        } catch (error) {
            return res.status(500).json({"message": `Error al publicar el comentario ${error}`, status: 500});
        }
    } catch (error) {
        return res.status(500).json({"message": `Error al publicar el comentario ${error}`, status: 500});
    }
}

//FUNCIÓN QUE RETORNA LOS COMENTARIOS DE UNA PUBLICACION
export async function getComentarios(req, res) {
    try {
        //SE OBTIENE LA INFORMACIÓN DE LA PETICIÓN:
        const id_publicacion = req.params.id_publicacion;

        let [response] = await pool.query('SELECT pc.id, u.nombres, u.apellidos, pc.mensaje FROM publicacion_comentario pc JOIN usuario u ON u.r_academico = pc.id_usuario WHERE pc.id_publicacion = ?', [id_publicacion])
        return res.status(200).json({status: 200, comentarios: response})
    } catch (error) {
        return res.status(500).json({"message": `Error al obtener los comentarios de la publicación ${error}`});
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

//FUNCION PARA REGISTRAR UNA PUBLICACION
export async function crearPublicacion(req, res){
    try {
        let id_usuario = req.params.id_usuario
        let {tipo, titulo, mensaje} = req.body
        //SI NO SE ENVIAN TODOS LOS DATOS
        if(!id_usuario || !tipo || !titulo || !mensaje){
            return res.status(400).json({status: 400, message: "No se proporcionaron todos los datos, intente de nuevo."})
        }
        try {
            //SE ENVÍA LA QUERY A LA BASE DE DATOS
            let response = await pool.query('INSERT INTO publicacion (id_usuario, tipo, titulo, mensaje) VALUES (?, ?, ?, ?)', [id_usuario, tipo, titulo, mensaje])
            return res.status(200).json({message: "Publicacion creada con éxito."})
        } catch (error) {
            return res.status(500).json({status: 500, message: "Ocurrió un error en la base de datos."})
        }      
    } catch (error) {
        return res.status(500).json({status: 500, message: "Ocurrió un error interno al crear la publicación."})
    }
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
                        { expiresIn: "10m" } // Expiración del token
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