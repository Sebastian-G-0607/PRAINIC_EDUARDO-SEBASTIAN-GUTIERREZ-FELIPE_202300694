import { useState, useEffect } from "react";
import axios from 'axios';
import "./crearPublicacion.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const CrearPublicacion = () => {
    const [tipo, setTipo] = useState("");
    const [titulo, setTitulo] = useState([]);
    const [tituloSend, setTituloSend] = useState("");
    const [mensaje, setMensaje] = useState("");
    const token = localStorage.getItem('token')

    useEffect(() => {
        if(tipo === "") return
        if(tipo === "curso"){
            (async () => {
                let response = await axios.get('http://localhost:4000/cursos', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setTitulo(response.data)
            })()
        }
        if(tipo === "catedratico"){
            (async () => {
                let response = await axios.get('http://localhost:4000/catedraticos', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setTitulo(response.data)
            })()
        }
    }, [tipo])

    // Manejador de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tipo || !tituloSend || !mensaje.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Algo salió mal",
                text: "Por favor, completa todos los campos antes de publicar.",
            });
            return;
        }

        const data = {
            tipo: tipo,
            titulo: tituloSend,
            mensaje: mensaje
        };

        (async () => {
            const decoded = jwtDecode(token);
            let response = await axios.post(`http://localhost:4000/crearPublicacion/${decoded.id}`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Publicación creada con éxito",
                });
            }
            else{
                Swal.fire({
                    icon: "error",
                    title: "Error al crear la publicación",
                });
            }
        })()

        

        setTipo("");
        setTitulo([]);
        setMensaje("");
    };

    const convertirNombrePropio = (cadena) => {
        return cadena
            .toLowerCase() // Convertimos todo a minúsculas
            .replace(/(^|\s)([a-záéíóúüñ])/g, (match, espacio, letra) => 
                espacio + letra.toUpperCase() // Convierte solo la primera letra después de un espacio o inicio
            );
    };

    return (
        <div className="crear-publicacion-container">
            <h2>Crear Nueva Publicación</h2>

            <form className="crear-publicacion-form" onSubmit={handleSubmit}>
                <label>Tipo:</label>
                <select name="tipo" value={tipo} onChange={(e) => {setTipo(e.target.value)}} required>
                    <option value="">Selecciona un tipo</option>
                    <option value="curso">Curso</option>
                    <option value="catedratico">Catedrático</option>
                </select>

                <label>Título:</label>
                <select name="titulo" value={tituloSend} onChange={(e) => {setTituloSend(e.target.value)}} required>
                    <option value="">Selecciona un título</option>
                    {titulo.map(e =>
                        <option key={`${e.nombre} ${e.seccion}`} value={`${e.nombre} sección ${e.seccion}`}>{convertirNombrePropio(e.nombre)} sección {e.seccion}</option>
                    )}
                </select>

                <label>Mensaje:</label>
                <textarea
                    name="mensaje"
                    placeholder="Escribe el mensaje aquí..."
                    value={mensaje}
                    onChange={(e) => {setMensaje(e.target.value)}}
                    required
                ></textarea>

                <button type="submit">Publicar</button>
            </form>
        </div>
    );
};

export default CrearPublicacion;
