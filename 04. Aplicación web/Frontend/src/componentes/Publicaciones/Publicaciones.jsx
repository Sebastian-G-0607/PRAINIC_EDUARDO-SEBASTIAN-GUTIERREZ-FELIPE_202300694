import { useState } from "react";
import Publicacion from "../Publicacion/Publicacion.jsx"; // Asegúrate de importar el componente correcto
import "./Publicaciones.css";

const Publicaciones = () => {
    // Estado con publicaciones simuladas (esto luego se puede conectar a una API)
    const [publicaciones, setPublicaciones] = useState([
        {
            id: 1,
            usuario: "Juan Pérez",
            tipo: "Aviso",
            nombre: "Clase de Matemáticas",
            mensaje: "La clase de hoy será reprogramada para el próximo lunes a las 10 AM.",
            fecha: "12 de marzo de 2025",
        },
        {
            id: 2,
            usuario: "Ana López",
            tipo: "Evento",
            nombre: "Conferencia de Inteligencia Artificial",
            mensaje: "Invitamos a todos a participar en nuestra conferencia anual sobre IA.",
            fecha: "10 de marzo de 2025",
        },
        {
            id: 3,
            usuario: "Carlos Ramírez",
            tipo: "Recordatorio",
            nombre: "Entrega de Proyecto Final",
            mensaje: "Recuerden que la entrega del proyecto final es el 15 de marzo.",
            fecha: "8 de marzo de 2025",
        },
    ]);

    return (
        <div className="contenedor-publicaciones">
            <h2>📰 Últimas Publicaciones</h2>
            <div className="lista-publicaciones">
                {publicaciones.map((pub) => (
                    <Publicacion 
                        key={pub.id}
                        usuario={pub.usuario}
                        tipo={pub.tipo}
                        nombre={pub.nombre}
                        mensaje={pub.mensaje}
                        fecha={pub.fecha}
                    />
                ))}
            </div>
        </div>
    );
};

export default Publicaciones;
