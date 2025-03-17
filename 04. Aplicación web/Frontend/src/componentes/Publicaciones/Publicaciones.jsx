import { useEffect, useState } from "react";
import axios from 'axios';
import Publicacion from "../Publicacion/Publicacion.jsx"; // Asegúrate de importar el componente correcto
import "./Publicaciones.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { esTokenValido } from "../verificarToken/verificarJWT.jsx";


const Publicaciones = () => {

    //Obtener token del localStorage
    const token = localStorage.getItem("token");


    const [publicaciones, setPublicaciones] = useState([]);
    const [filtro, setFiltro] = useState(""); // Filtrar por curso/catedrático
    const [busquedaCurso, setBusquedaCurso] = useState(""); // Buscar por curso
    const [busquedaCatedratico, setBusquedaCatedratico] = useState(""); // Buscar por catedrático

    //Obtener publicaciones al cargar la página
    useEffect(() => {
        (async () => {
            try {
                let response = await axios.get("http://localhost:4000/publicaciones", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setPublicaciones(response.data);
            } catch (error) {
                console.error("Error al obtener publicaciones:", error);
            }
        })();
    }, []);

    //Filtrar publicaciones dinámicamente
    const filtrar = () => {
        if(!filtro && !busquedaCatedratico && !busquedaCurso){
            return publicaciones;
        }
        else if (filtro) {
            return publicaciones.filter(p => p.tipo === filtro)
        }
        else if (busquedaCatedratico) {
            return publicaciones.filter(p => (p.tipo === "catedratico" && p.titulo.toLowerCase().includes(busquedaCatedratico.toLowerCase())))
        }
        else if (busquedaCurso) {
            return publicaciones.filter(p => (p.tipo === "curso" && p.titulo.toLowerCase().includes(busquedaCurso.toLowerCase())))
        }
    }

    const publicacionesFiltradas = filtrar();

    return (
        <div className="contenedor-publicaciones">
            <h2>📰 Últimas Publicaciones</h2>

            {/* 📌 Controles de Filtro */}
            <div className="filtros-publicaciones">
                <input
                    type="text"
                    placeholder="Buscar por curso"
                    value={busquedaCurso}
                    onChange={(e) => {setBusquedaCurso(e.target.value); setBusquedaCatedratico(""); setFiltro("")}}
                    className="filtro-input"
                />
                <input
                    type="text"
                    placeholder="Buscar por catedrático"
                    value={busquedaCatedratico}
                    onChange={(e) => {setBusquedaCatedratico(e.target.value); setBusquedaCurso(""); setFiltro("")}}
                    className="filtro-input"
                />
                <select
                    value={filtro}
                    onChange={(e) => {setFiltro(e.target.value); setBusquedaCatedratico(""); setBusquedaCurso("")}}
                    className="filtro-select"
                >
                    <option value="">Filtrar por</option>
                    <option value="curso">Curso</option>
                    <option value="catedratico">Catedrático</option>
                </select>
            </div>

            {/* 📌 Lista de Publicaciones Filtradas */}
            <div className="lista-publicaciones">
                {publicacionesFiltradas.map((pub) => (
                    <Publicacion 
                        key={pub.id}
                        id={pub.id}
                        usuario={`${pub.nombres} ${pub.apellidos}`}
                        tipo={pub.tipo}
                        nombre={pub.titulo}
                        mensaje={pub.mensaje}
                        fecha={new Date(pub.fecha).toLocaleString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "America/Guatemala"
                        })}
                    />
                ))}
            </div>
        </div>
    );
};

export default Publicaciones;
