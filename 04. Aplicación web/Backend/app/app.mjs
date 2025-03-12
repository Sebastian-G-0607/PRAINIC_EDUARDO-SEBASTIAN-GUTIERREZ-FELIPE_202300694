//SE IMPORTA EL FRAMEWORK EXPRESS PARA CREAR LA APP
import express from 'express';
import cors from 'cors'; //cors para políticas
import bodyParser from 'body-parser';



//SE REALIZA UNA INSTANCIA DE EXPRESS
export const app = express();

//Usando los middlewares
//Middleware que comprueba si la request es json y si es de tipo post, luego convierte el body de la req a json
app.use(express.json({ limit: "15mb" })); // Permite archivos de hasta 15MB
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use(bodyParser.json({limit: '15mb'}));
app.use(cors());


//Importación de endpoints
import {router} from '../routes/routes.mjs';

app.use(router);