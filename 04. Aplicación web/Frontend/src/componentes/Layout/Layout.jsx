import { Outlet, Link } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
    return (
        <div className="layout">
            <nav className="navbar">
                <Link to="home" className="nav-link">Home</Link>
                <Link to="/crear-publicacion" className="nav-link">Crear Publicación</Link>

                <Link to="/cursos-aprobados" className="nav-link">Cursos Aprobados</Link>
                
                <input 
                    type="text" 
                    placeholder="Buscar usuario por registro académico" 
                    className="search-input"
                />
                <Link to="/perfil" className="perfil-icon">
                    <img 
                        width="48" 
                        height="48" 
                        src="https://img.icons8.com/puffy-filled/32/test-account.png"
                        alt="Perfil"
                    />
                </Link>
            </nav>

            <div className="contenido">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
