import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./cursoAprobado.css";

const CursoAprobado = ({ id, nombre, seccion, aprobado}) => {
    //OBTENEMOS EL TOKEN:
    const token = localStorage.getItem("token");
    //ESTADO DEL COMPONENTE
    const [seleccionado, setSeleccionado] = useState(aprobado);

    // 📌 Función cuando se marca el checkbox
    const handleSeleccionar = () => {
        setSeleccionado(true);
        //DECODIFICO EL TOKEN:
        const decoded = jwtDecode(token)
        const data = {
            id_curso: id
        };
        (async () => {
            let response = await axios.post(`http://localhost:4000/aprobarCurso/${decoded.id}`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data.message);
        })() 
    };

    // 📌 Función cuando se desmarca el checkbox
    const handleDesmarcar = () => {
        setSeleccionado(false);
        //DECODIFICO EL TOKEN:
        const decoded = jwtDecode(token)
        const data = {
            id_curso: id
        };
        (async () => {
            let response = await axios.post(`http://localhost:4000/quitarCurso/${decoded.id}`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data.message);
        })() 
    };

    return (
        <div className={`curso-aprobado-container ${seleccionado ? "seleccionado" : ""}`}>
            <input 
                type="checkbox" 
                checked={seleccionado} 
                onChange={(e) => e.target.checked ? handleSeleccionar() : handleDesmarcar()} 
                className="curso-checkbox"
            />
            <div className="curso-detalles">
                <p className="curso-nombre">{nombre}</p>
                <p className="curso-seccion">Sección: <span>{seccion}</span></p>
            </div>
        </div>
    );
};

export default CursoAprobado;
