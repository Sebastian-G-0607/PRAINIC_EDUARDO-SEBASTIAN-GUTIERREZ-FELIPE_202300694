import { useState, useEffect } from "react";
import { Link, resolvePath } from "react-router-dom";
import axios from 'axios';
import Swal from "sweetalert2";
import "./Registrarse.css";

const Registrarse = () => {

    //VARIABLES DEL FORMULARIO:
    const [carne, setCarne] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    //FUNCIÓN PARA ENVIAR EL FORMULARIO 
    const handleRegister = (e) => {
        e.preventDefault();

        //SE CREA EL JSON PARA ENVIAR:
        /*{
            "registro": 20202020,
            "nombres": "1NOMBRE 2NOMBRE",
            "apellidos": "1APELLIDO 2APELLIDO",
            "correo": "correo@gmail.com",
            "contrasenia": "CONTRASEÑA"
        }*/
        
        let data = {
            registro: carne,
            nombres: nombre,
            apellidos: apellido,
            correo: correo,
            contrasenia: password
        };

        //SE UTILIZA UNA IIFE PARA REALIZAR LA PETICIÓN AL BACK
        (async () => {
            //SE REALIZA LA PETICIÓN AL BACKEND
            try {
                let response = await axios.post('http://localhost:4000/registrar-usuario', data)
                if(response.data.status === 200){
                    //SE VACÍAN LOS CAMPOS DE ENTRADA
                    setCarne("");
                    setNombre("");
                    setApellido("");
                    setCorreo("");
                    setPassword("");
                    Swal.fire({
                        text: "El usuario fue creado con éxito",
                        icon: "success"
                    })

                }
                else{
                    Swal.fire({
                        text: "Ocurrió un error al crear el usuario. Intente de nuevo",
                        icon: "error"
                    })
                }
            } catch (error) {
                Swal.fire({
                    text: "Ocurrió un error interno al crear el usuario. Intente de nuevo",
                    icon: "error"
                })
            }
        })();


    }

    return (
        <div className="register-container">
            <form onSubmit={(e) => {handleRegister(e)}}>
                <div className="register-box">
                    {/* Contenedor de la imagen */}
                    <div className="register-logo">
                        <img src="https://portal.ingenieria.usac.edu.gt/images/logo_facultad/fiusac_negro.png" alt="FIUSAC Logo" />
                    </div>

                    <h2 className="register-title">Crear Cuenta</h2>

                    <input type="number" className="register-input" placeholder="Registro académico" value={carne} onChange={(e) => setCarne(e.target.value)} />
                    <input type="text" className="register-input" placeholder="Nombres" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <input type="text" className="register-input" placeholder="Apellidos" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    <input type="email" className="register-input" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    <input type="password" className="register-input" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit" className="register-button">Registrarse</button>

                    {/* Enlace para volver al login */}
                    <div className="register-links">
                        <Link to="/login" className="back-to-login">¿Ya tienes cuenta? Inicia sesión</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Registrarse;
