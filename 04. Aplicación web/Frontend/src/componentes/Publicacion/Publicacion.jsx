import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./Publicacion.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Publicacion = ({ id, usuario, tipo, nombre, mensaje, fecha }) => {
    const [comentario, setComentario] = useState("");
    //SE OBTIENE EL TOKEN DEL USUARIO:
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    //PARA NAVEGAR
    const navigate = useNavigate();

    const handleEnviarComentario = () => {
        //SE CREA LA DATA A ENVIAR
        const data = {
            id_user: decoded.id,
            mensaje: comentario
        };
        (async () => {
            let response = await axios.post(`http://localhost:4000/publicarComentario/${id}`, data, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(response.data.status === 200){
                Swal.fire({
                    text: `El comentario fue publicado`,
                    icon: "success"
                })
            }
            else{
                Swal.fire({
                    text: `Hubo un error al publicar el comentario`,
                    icon: "error"
                })
            }
        })()
    };

    const handleVerComentarios = () => {
        //SE DIRIGE A LA PÁGINA DE VER COMENTARIOS
        navigate(`ver-comentarios/${id}`);
    }

    return (
        <div className="publicacion">
            <div className="publicacion-header">
                <p><strong>Publicación realizada por:</strong> {usuario}</p>
                <p><strong>Tipo:</strong> {tipo}</p>
                <p><strong>Titulo:</strong> {nombre}</p>
            </div>

            <div className="publicacion-mensaje">
                <p>{mensaje}</p>
            </div>

            <div className="publicacion-footer">
                <p><strong>Fecha de publicación:</strong> {fecha}</p>

                <div className="publicacion-comentarios">
                    <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    />
                    <button onClick={handleEnviarComentario}>Enviar</button>
                    <button className="ver-comentarios" onClick={handleVerComentarios}>Ver Comentarios</button>
                </div>
            </div>
        </div>
    );
};

export default Publicacion;
