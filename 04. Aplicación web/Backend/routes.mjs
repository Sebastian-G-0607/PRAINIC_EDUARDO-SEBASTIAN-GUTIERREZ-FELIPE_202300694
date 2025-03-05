//instancia del framework express
import express from 'express';

//Objeto para hacer rutas
export const router = express.Router();

//SE IMPORTAN LAS FUNCIONES
import { getCursos } from './consultas.mjs';

//SE CREAN LOS ENDPOINTS

router.get('/cursos', getCursos);
