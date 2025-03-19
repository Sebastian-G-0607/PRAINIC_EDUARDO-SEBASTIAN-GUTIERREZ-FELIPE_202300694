import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./recuperarContrasenia.css";

const RecuperarContrasenia = () => {
    //RECUPERO EL TOKEN:
    const token = localStorage.getItem("token");

    //VARIABLES
    const [carne, setCarne] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    //FUNCIÓN PARA ENVIAR LA PETICIÓN AL BACK:
    const handleRecuperar = async (e) => {
        e.preventDefault();

        let data = {
            correo: correo,
            contrasenia: password
        };

        try {
            let response = await axios.put(`http://localhost:4000/recuperar-contrasenia/${carne}`, data);
            if (response.data.status === 200) {
                setCarne("");
                setCorreo("");
                setPassword("");
                Swal.fire({
                    text: "Tu contraseña ha sido restablecida con éxito",
                    icon: "success"
                });
            } else {
                Swal.fire({
                    text: "No se pudo recuperar la contraseña. Verifica tu información.",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                text: "Error interno al recuperar la contraseña. Intenta nuevamente.",
                icon: "error"
            });
        }
    };

    return (
        <div className="recuperar-container">
            <form onSubmit={handleRecuperar}>
                <div className="recuperar-box">

                    <div className="recuperar-logo">
                        <img src="https://portal.ingenieria.usac.edu.gt/images/logo_facultad/fiusac_negro.png" alt="FIUSAC Logo" />
                    </div>

                    <h2 className="recuperar-title">Recuperar Contraseña</h2>

                    <input 
                        type="number" 
                        className="recuperar-input" 
                        placeholder="Registro académico" 
                        value={carne} 
                        onChange={(e) => setCarne(e.target.value)} 
                        required
                    />
                    <input 
                        type="email" 
                        className="recuperar-input" 
                        placeholder="Correo electrónico" 
                        value={correo} 
                        onChange={(e) => setCorreo(e.target.value)} 
                        required
                    />
                    <input 
                        type="password" 
                        className="recuperar-input" 
                        placeholder="Nueva contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />

                    <button type="submit" className="recuperar-button">Restablecer Contraseña</button>

                    <div className="recuperar-links">
                        <Link to="/login" className="back-to-login">Volver al inicio de sesión</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RecuperarContrasenia;
