import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "./Login.css";
import Swal from "sweetalert2";

const Login = () => {

    //VARIABLES QUE ALMACENARÁN LOS VALORES DEL USUARIO Y DE LA CONTRASEÑA:
    const[user, setUser] = useState('');
    const[password, setPassword] = useState('');

    //FUNCIÓN QUE SE EJECUTA AL ENVIAR EL FORMULARIO:
    const handleLogin = (e) => {
        e.preventDefault();
        //SE CREA EL OBJETO CON LAS CREDENCIALES DEL USUARIO:
    
        //SE ENVÍA LA PETICIÓN AL BACKEND, CON UNA IIFE
        (async () => {
            console.log("hola");
            try {
                const response = await axios.get(`http://localhost:4000/login/${user}/${password}`);
                console.log(response);
                if(response.status === 200){
                    Swal.fire({
                        text: `Bienvenido ${response.data.nombre}`,
                        icon: "success"
                    })
                    localStorage.setItem("token", response.data.token); // Guardamos el token que envió el backend
                }
            } catch (error) {
                Swal.fire({
                    text: `Ocurrió un error al iniciar sesión`,
                    icon: "error"
                })
            }
            
        })()
    }

    //CÓDIGO QUE RETORNA EL COMPONENTE
    return (
        <div className="login-container">
            <div className="login-box">
                {/* Contenedor de la imagen */}
                <div className="login-logo">
                    <img src="https://portal.ingenieria.usac.edu.gt/images/logo_facultad/fiusac_negro.png" alt="FIUSAC Logo" />
                </div>

                <h2 className="login-title">Iniciar Sesión</h2>
                
                <form onSubmit={(e) => {handleLogin(e)}}>
                    <input type="text" className="login-input" placeholder="Registro académico" value={user} onChange={(e) => {setUser(e.target.value)}} />
                    <input type="password" className="login-input" placeholder="Contraseña" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                    <button className="login-button" type="submit">Iniciar Sesión</button>
                </form>
                
                {/* Opciones adicionales */}
                <div className="login-links">
                    <Link to="#" className="forgot-password">¿Olvidaste tu contraseña?</Link>
                    <span className="separator">|</span>
                    <Link to="/sign-up" className="register-link">Registrarse</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
