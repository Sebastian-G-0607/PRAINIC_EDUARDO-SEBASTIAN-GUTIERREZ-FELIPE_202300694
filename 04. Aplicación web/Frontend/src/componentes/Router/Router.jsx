import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { esTokenValido } from '../verificarToken/verificarJWT.jsx';
import Login from '../Login/login.jsx';
import Registrarse from '../Registrar/Registrar.jsx';
import Layout from '../Layout/Layout.jsx'
import Publicaciones from '../Publicaciones/Publicaciones.jsx';
import CrearPublicacion from '../crearPublicacion/crearPublicacion.jsx'
import Perfil from '../verPerfil/verPerfil.jsx';
import CursosAprobados from '../CursosAprobados/cursosAprobados.jsx';
import VerOtro from '../verOtroUsuario/verOtro.jsx';
import RequireAuth from '../verificarToken/RequireAuth.jsx';
import RecuperarContrasenia from '../recuperarContrasenia/recuperarContrasenia.jsx';
import Comentarios from '../comentarios/comentarios.jsx';

//COMPONENTE QUE MANEJA LAS DIRECCIONES
function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/sign-up' element={<Registrarse />} />
                <Route path='/recuperar-contrasenia' element={<RecuperarContrasenia />} />
                <Route path="/user" element={<RequireAuth />}>
                        <Route path="home" element={<Publicaciones />} />
                        <Route path="crear-publicacion" element={<CrearPublicacion />} />
                        <Route path="perfil" element={<Perfil />} />
                        <Route path="cursos-aprobados" element={<CursosAprobados />} />
                        <Route path="ver/:id" element={<VerOtro />} />
                        <Route path="home/ver-comentarios/:id_publicacion" element={<Comentarios />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;