//instancia del framework express
import express from 'express';
import { verificarToken } from "../middlewares/verificarJWT.mjs";

//Objeto para hacer rutas
export const router = express.Router();

//SE IMPORTAN LAS FUNCIONES
import { getCursos, registrarUsuario, Login, getCatedraticos, 
    crearPublicacion, getPublicaciones, getUsuario, getCursosAprobados, 
    aprobarCurso, quitarCurso, verOtro, actualizarUsuario, recuperarContrasenia, 
    publicarComentario, getComentarios } from '../controllers/consultas.mjs';

//SE CREAN LOS ENDPOINTS

//RUTAS PROTEGIDAS:
router.get('/cursos', verificarToken, getCursos);
router.get('/catedraticos', verificarToken, getCatedraticos);
router.get('/publicaciones', verificarToken, getPublicaciones);
router.get('/user/:id_user', verificarToken, getUsuario);
router.get('/cursos/:id_user', verificarToken, getCursosAprobados);
router.get('/ver/:id_user', verificarToken, verOtro);
router.get('/verComentarios/:id_publicacion', verificarToken, getComentarios);

router.post('/aprobarCurso/:id_user', verificarToken, aprobarCurso);
router.post('/quitarCurso/:id_user', verificarToken, quitarCurso);
router.post('/crearPublicacion/:id_usuario', verificarToken, crearPublicacion);
router.post('/publicarComentario/:id_publicacion', verificarToken, publicarComentario);

router.put('/actualizar-usuario/:id_user', verificarToken, actualizarUsuario);

//RUTAS PÚBLICAS:
router.get('/login/:carnet/:contrasenia', Login);
router.post('/registrar-usuario', registrarUsuario);
router.put('/recuperar-contrasenia/:id_user', recuperarContrasenia);