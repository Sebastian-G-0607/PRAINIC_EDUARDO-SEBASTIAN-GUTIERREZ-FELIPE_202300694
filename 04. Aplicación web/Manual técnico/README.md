# Manual Técnico

## Integrantes

- **Christian David Chinchilla Santos** - Carné: 202308227  
- **Eduardo Sebastian Gutierrez Felipe** - Carné: 202300694  

Estudiantes de la Facultad de Ingeniería en Ciencias y Sistemas de la Universidad de San Carlos de Guatemala.

---

## Descripción del Proyecto

Este proyecto implementa un backend utilizando **Node.js** con el framework **Express** y **MySQL** como base de datos. Se gestionan usuarios, cursos y publicaciones, con autenticación basada en **JWT**.

---

## Configuración

1. Instalar dependencias:
   ```sh
   npm install
   ```
2. Configurar variables de entorno en un archivo `.env`:
   ```env
   SECRET_KEY=clave_secreta
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=nombre_base_datos
   ```
3. Iniciar el servidor:
   ```sh
   npm start
   ```

---

## Controllers

Los **Controllers** contienen la lógica del backend. Aquí se manejan las solicitudes HTTP y la comunicación con la base de datos.

### 1. `parseCarnet(carnet)`
Convierte un carné en número si contiene solo dígitos. Si el carné incluye caracteres no numéricos, devuelve `NaN`. Esto es útil para validar la entrada antes de procesarla.
```javascript
const parseCarnet = (carnet) => {
    if (/^\d+$/.test(carnet)) {
        return Number(carnet);
    } else {
        return NaN;
    }
};
```

### 2. `validarCorreo(correo)`
Verifica si un correo tiene una sintaxis válida utilizando una expresión regular. Si la dirección de correo electrónico cumple con el formato estándar, devuelve `true`; de lo contrario, devuelve `false`.
```javascript
const validarCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
};
```

### 3. `getCursos(req, res)`
Obtiene todos los cursos registrados en la base de datos y los devuelve en formato JSON. Se utiliza una consulta SQL para recuperar la información de la tabla `curso`.
```javascript
export async function getCursos (req, res) {
    try {
        const [response] = await pool.query('SELECT id, nombre, seccion FROM curso')
        return res.json(response);
    } catch (error) {
        return res.status(500).json({"error": `Server error ${error}`})
    }
}
```

### 4. `registrarUsuario(req, res)`
Registra un nuevo usuario en la base de datos. Primero, valida los datos ingresados (como el carné y el correo). Luego, encripta la contraseña antes de guardarla en la base de datos para mayor seguridad.
```javascript
export async function registrarUsuario (req, res) {
    try {
        let { registro, nombres, apellidos, correo, contrasenia } = req.body;
        let nRegistro = parseCarnet(registro);
        if (Number.isInteger(nRegistro) && validarCorreo(correo)) {
            const hashedPassword = await hash(contrasenia, 10);
            await pool.query('INSERT INTO usuario (r_academico, nombres, apellidos, contrasenia, correo) values (?, ?, ?, ?, ?)', [nRegistro, nombres, apellidos, hashedPassword, correo]);
            return res.status(200).json({ status: 200, message: "Usuario creado con éxito" });
        }
        return res.status(400).json({ status: 400, message: "No se puedo crear el usuario" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "No se pudo crear el usuario", error: error });
    }
}
```

---

## Rutas (Endpoints)

Los endpoints definen cómo se accede a los datos y las funcionalidades del sistema. Algunas rutas están protegidas con un **middleware** de verificación de tokens JWT.

### Rutas Protegidas (Requieren Token JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/cursos` | Obtiene todos los cursos registrados en la base de datos. |
| `GET`  | `/catedraticos` | Obtiene la lista de catedráticos ordenados alfabéticamente. |
| `GET`  | `/publicaciones` | Obtiene todas las publicaciones registradas. |
| `GET`  | `/user/:id_user` | Obtiene la información personal de un usuario. |
| `GET`  | `/cursos/:id_user` | Obtiene los cursos aprobados por un usuario. |
| `POST` | `/aprobarCurso/:id_user` | Marca un curso como aprobado para un usuario en la base de datos. |
| `POST` | `/quitarCurso/:id_user` | Elimina un curso aprobado de un usuario. |
| `POST` | `/crearPublicacion/:id_usuario` | Registra una nueva publicación con un título y mensaje. |
| `POST` | `/publicarComentario/:id_publicacion` | Agrega un comentario a una publicación. |
| `PUT`  | `/actualizar-usuario/:id_user` | Actualiza los datos de un usuario, incluyendo su contraseña y correo. |

### Rutas Públicas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/login/:carnet/:contrasenia` | Inicia sesión y retorna un token JWT si las credenciales son correctas. |
| `POST` | `/registrar-usuario` | Registra un nuevo usuario en la base de datos. |
| `PUT`  | `/recuperar-contrasenia/:id_user` | Restablece la contraseña de un usuario si proporciona un correo válido. |

---

## Middleware

El middleware de autenticación **verifica que el token JWT sea válido** antes de permitir el acceso a rutas protegidas.

### `verificarToken(req, res, next)`
```javascript
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verificarToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ message: "Acceso denegado" });
    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};
```

---

## Notas Adicionales
- Se utiliza `bcryptjs` para hashear contraseñas y protegerlas antes de almacenarlas en la base de datos.
- El sistema de autenticación está basado en **JSON Web Tokens (JWT)**, lo que permite validar sesiones de usuario.
- La base de datos MySQL se gestiona a través de un **pool de conexiones** para mejorar el rendimiento y evitar saturación.

Este documento está sujeto a cambios conforme evoluciona el proyecto.
