import { useState } from "react";
import "./Publicacion.css";

const Publicacion = ({ usuario, tipo, nombre, mensaje, fecha }) => {
    const [comentario, setComentario] = useState("");

    const handleEnviarComentario = () => {
        if (comentario.trim()) {
            alert(`Comentario enviado: ${comentario}`);
            setComentario(""); // Limpiar el campo después de enviar
        }
    };

    return (
        <div className="publicacion">
            <div className="publicacion-header">
                <p><strong>Publicación realizada por:</strong> {usuario}</p>
                <p><strong>Tipo:</strong> {tipo}</p>
                <p><strong>Nombre:</strong> {nombre}</p>
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
                    <button className="ver-comentarios">Ver Comentarios</button>
                </div>
            </div>
        </div>
    );
};

export default Publicacion;
