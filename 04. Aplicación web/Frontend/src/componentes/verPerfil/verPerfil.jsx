import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./verPerfil.css";
import Swal from "sweetalert2";


const Perfil = () => {
    //VARIABLES
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [correo, setCorreo] = useState("");

    //VARIABLES DE COMPARACIÓN:
    const [nombresC, setNombresC] = useState("");
    const [apellidosC, setApellidosC] = useState("");
    const [contraseniaC, setContraseniaC] = useState("");
    const [correoC, setCorreoC] = useState("");

    //SE GUARDA EL TOKEN
    const token = localStorage.getItem("token")
    const decoded = jwtDecode(token);

    //EN LA PRIMERA RENDERIACION, SOLICITAMOS LOS DATOS:
    useEffect(() => {
        (async () => {
            let response = await axios.get(`http://localhost:4000/user/${decoded.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            let info = response.data[0];
            //SE ESTABLECEN LAS VARIABLES PRINCIPALES
            setNombres(info.nombres);
            setApellidos(info.apellidos);
            setContrasenia(info.contrasenia);
            setCorreo(info.correo);

            //SE ESTABLECEN LAS VARIABLES DE COMPARACIÓN:
            setNombresC(info.nombres);
            setApellidosC(info.apellidos);
            setContraseniaC(info.contrasenia);
            setCorreoC(info.correo);
        })()
    }, [])

    const handleSumbit = (e) => {
        e.preventDefault();
        if (nombres === nombresC && apellidos === apellidosC && contrasenia === contraseniaC && correo === correoC) {
            Swal.fire({
                icon: "warning",
                title: "No se puede actualizar",
                text: "Por favor, actualice al menos un campo.",
            });
        }
        else{
            //SE GUARDA LA DATA A ENVIAR AL BACK:
            const data = {               
                nombres: nombres,
                apellidos: apellidos,
                contrasenia: contrasenia,
                correo: correo         
            }
            axios.put(`http://localhost:4000/actualizar-usuario/${decoded.id}`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            Swal.fire({
                icon: "success",
                title: "Actualizado con éxito",
                text: "Sus datos fueron actualizados con éxito",
            });
        }
    }

    return (
        <div className="perfil-page-container">
            <h2 className="perfil-title">👤 Mi Perfil</h2>

            <form className="perfil-form-container" onSubmit={(e) => {handleSumbit(e)}}>
                <label className="perfil-label">Registro Académico:</label>
                <input type="text" name="registroAcademico" value={decoded.id} className="perfil-input perfil-readonly" readOnly />

                <label className="perfil-label">Nombres:</label>
                <input type="text" name="nombres" value={nombres} onChange={(e) => {setNombres(e.target.value)}} className="perfil-input" />

                <label className="perfil-label">Apellidos:</label>
                <input type="text" name="apellidos" value={apellidos} onChange={(e) => {setApellidos(e.target.value)}} className="perfil-input" />

                <label className="perfil-label">Contraseña:</label>
                <input type="password" name="contrasena" value={contrasenia} onChange={(e) => {setContrasenia(e.target.value)}} className="perfil-input" />

                <label className="perfil-label">Correo Electrónico:</label>
                <input type="email" name="correo" value={correo} onChange={(e) => {setCorreo(e.target.value)}} className="perfil-input" />

                <button type="submit" className="perfil-button">Actualizar Información</button>
            </form>
        </div>
    );
};

export default Perfil;
