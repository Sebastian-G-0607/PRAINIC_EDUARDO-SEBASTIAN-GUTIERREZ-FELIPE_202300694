import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/login.jsx';

//COMPONENTE QUE MANEJA LAS DIRECCIONES
function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />

            </Routes>
        </BrowserRouter>
    );
}

export default Router;