import { useEffect, useState } from "react";
import CursoAprobado from "../cursoAprobado/cursoAprobado"; // Asegúrate de importar correctamente el componente
import "./cursosAprobados.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CursosAprobados = () => {
    const [cursos, setCursos] = useState([]);
    const [aprobados, setAprobados] = useState([]);
    const [state, setState] = useState(false);
    
    //SE OBTIENE EL TOKEN
    const token = localStorage.getItem("token");

    useEffect(() => {
        //REALIZAMOS LA PETICIÓN INICIAL AL BACKEND
        const obtenerCursos = async () => {
            try {
                const response = await axios.get("http://localhost:4000/cursos", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCursos(response.data);

                //SE DECODIFICA EL TOKEN PARA OBTENER EL ID DEL USUARIO:
                const decoded = jwtDecode(token);
                const response2 = await axios.get(`http://localhost:4000/cursos/${decoded.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                //Crear un nuevo Set con los cursos aprobados
                const nuevosAprobados = response2.data.map(element => element.id_curso);
                            
                //Actualizar el estado con el nuevo Set
                setAprobados(nuevosAprobados);
                setState(true)

            } catch (error) {
                console.error("Error al obtener los cursos aprobados:", error);
            }
        };

        obtenerCursos();
    }, []);

    if (state) {
        return (
            <div className="cursos-aprobados-container">
                <h2>📚 Cursos Aprobados</h2>

                {cursos.length === 0 ? (
                    <p className="mensaje-no-cursos">Ocurrió un error. Intente de nuevo.</p>
                ) : (
                    <div className="lista-cursos">
                        {cursos.map((curso) => (
                            <CursoAprobado key={curso.id} id={curso.id} nombre={curso.nombre} seccion={curso.seccion} aprobado={aprobados.includes(curso.id)} />
                        ))}
                    </div>
                )}
            </div>
        )
    }
    // else {
    //     return (
    //         <div className="cursos-aprobados-container">
    //             <h2>📚 Cursos Aprobados</h2>
    //             <div className="lista-cursos">
    //                 {cursos.map((curso) => (
    //                     <CursoAprobado key={curso.id} id={curso.id} nombre={curso.nombre} seccion={curso.seccion} aprobado={aprobados.includes(curso.id)} />
    //                 ))}
    //             </div>
    //         </div>
    //     )
    // }
};

export default CursosAprobados;
