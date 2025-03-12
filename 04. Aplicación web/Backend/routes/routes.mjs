//instancia del framework express
import express from 'express';

//Objeto para hacer rutas
export const router = express.Router();

//SE IMPORTAN LAS FUNCIONES
import { getCursos, registrarUsuario, Login } from '../controllers/consultas.mjs';

//SE CREAN LOS ENDPOINTS

router.get('/cursos', getCursos);
router.post('/registrar-usuario', registrarUsuario);
router.get('/login/:carnet/:contrasenia', Login);
