import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Layout.css";

const Layout = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda
    const navigate = useNavigate();

    //Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem("token"); // Elimina el token
        navigate("/login"); // Redirige al login
    };

    // Función para buscar usuario
    const handleBuscarUsuario = () => {
        if (busqueda.trim() !== "") {
            navigate(`/user/ver/${busqueda.trim()}`);
        }
    };

    return (
        <div className="layout">
            <nav className="navbar">
                <Link to="home" className="nav-link">Home</Link>
                <Link to="crear-publicacion" className="nav-link">Crear Publicación</Link>
                <Link to="cursos-aprobados" className="nav-link">Cursos Aprobados</Link>

                {/* 📌 Contenedor de búsqueda con lupa */}
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Buscar usuario por registro académico" 
                        className="search-input"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button className="search-button" onClick={handleBuscarUsuario}>
                        🔍
                    </button>
                </div>

                <div className="perfil-container">
                    <img 
                        width="48" 
                        height="48" 
                        src="https://img.icons8.com/puffy-filled/32/test-account.png"
                        alt="Perfil"
                        className="perfil-icon"
                        onClick={() => setMenuAbierto(!menuAbierto)} 
                    />

                    {menuAbierto && (
                        <div className="perfil-menu">
                            <Link to="perfil" className="perfil-option">👤 Ver perfil</Link>
                            <button onClick={handleLogout} className="perfil-option">🚪 Cerrar sesión</button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="contenido">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
