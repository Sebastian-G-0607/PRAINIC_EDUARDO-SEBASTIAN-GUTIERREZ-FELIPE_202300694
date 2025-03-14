import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/login.jsx';
import Registrarse from '../Registrar/Registrar.jsx';
import Layout from '../Layout/Layout.jsx'
import Publicaciones from '../Publicaciones/Publicaciones.jsx';

//COMPONENTE QUE MANEJA LAS DIRECCIONES
function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/sign-up' element={<Registrarse />} />
                <Route path="/user" element={<Layout />}>
                    <Route path="home" element={<Publicaciones />} />
                    <Route path="crear-publicacion" element={<Layout />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;