import { useEffect, useState } from "react";
import axios from "axios";
import "./comentarios.css";
import { useParams } from "react-router-dom";

const Comentarios = () => {
    //LISTA DE COMENTARIOS
    const [comentarios, setComentarios] = useState([]);
    const [state, setState] = useState(false);

    //SE OBTIENE EL TOKEN:
    const token = localStorage.getItem("token");

    //SE OBTIENE EL ID DE LA PUBLICACIÓN USANDO EL PARÁMETRO DE LA RUTA:
    const { id_publicacion } = useParams();

    useEffect(() => {
        //Obtiene los comentarios desde la API
        const obtenerComentarios = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/verComentarios/${id_publicacion}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if(response.data.status === 200){
                    setComentarios(response.data.comentarios);
                    setState(true);
                }
            } catch (error) {
                console.error("Error al obtener los comentarios:", error);
            }
        };

        obtenerComentarios();
    }, []);

    if (state === true) {
        return (
            <div className="comentarios-container">
                <h2>💬 Comentarios</h2>

                {comentarios.length === 0 ? (
                    <p className="no-comentarios">Aún no hay comentarios.</p>
                ) : (
                    <div className="lista-comentarios">
                        {comentarios.map((comentario) => (
                            <div key={comentario.id} className="comentario-box">
                                <p className="comentario-autor">✍️ <strong>{comentario.nombres} {comentario.apellidos}</strong></p>
                                <p className="comentario-mensaje">{comentario.mensaje}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
    else{
        return (
            <div className="comentarios-container">
                <h2>💬 Comentarios</h2>
                <p className="no-comentarios">Aún no hay comentarios.</p>
            </div>
        )
    }
};

export default Comentarios;
