import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./verOtro.css";

const VerOtro = () => {
    const { id } = useParams(); //Obtiene el ID del usuario desde la URL
    const [usuario, setUsuario] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [state, setState] = useState(false);

    //SE OBTIENE EL TOKEN:
    const token = localStorage.getItem("token")

    useEffect(() => {
        const obtenerUsuario = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/ver/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if(response.data.personal.length !== 0 && response.data.cursos.length !== 0) {
                    setUsuario(response.data.personal[0]);
                    setCursos(response.data.cursos);
                    setState(true)
                }
                else {
                    setState(false);
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            }
        };
        obtenerUsuario();
    }, [id]);

    if (state) { 
        return (
            <div className="ver-otro-container">
                <h2>👤 Perfil del Usuario</h2>

                {usuario ? (
                    <div className="usuario-info">
                        <p><strong>ID:</strong> {usuario.r_academico}</p>
                        <p><strong>Nombre:</strong> {`${usuario.nombres} ${usuario.apellidos}`}</p>
                        <p><strong>Correo:</strong> {usuario.correo}</p>
                    </div>
                ) : (
                    <p className="cargando">Cargando perfil...</p>
                )}

                <h3>📚 Cursos Aprobados</h3>

                {cursos.length === 0 ? (
                    <p className="cargando">Este usuario no tiene cursos aprobados.</p>
                ) : (
                    <div className="cursos-aprobados">
                        {cursos.map((curso) => (
                            <div key={`${curso.nombre} seccion ${curso.seccion}`} className="curso-card">
                                <h4>{curso.nombre}</h4>
                                <p><strong>Sección:</strong> {curso.seccion}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    else return (
        <div className="ver-otro-container">
            <h2>👤 El usuario que buscó no existe</h2>
        </div>
    )
};

export default VerOtro;
