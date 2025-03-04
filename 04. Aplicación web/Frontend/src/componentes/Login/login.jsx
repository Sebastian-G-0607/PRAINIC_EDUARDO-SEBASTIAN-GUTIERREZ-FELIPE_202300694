import { useState } from "react";
import "./Login.css";

const Login = () => {

    //VARIABLES QUE ALMACENARÁN LOS VALORES DEL USUARIO Y DE LA CONTRASEÑA:
    const[user, setUser] = useState('');
    const[password, setPassword] = useState('');

    //FUNCIÓN QUE SE EJECUTA AL ENVIAR EL FORMULARIO:
    const handleLogin = (e) => {
        e.preventDefault();
        //SE ENVÍA LA PETICIÓN AL BACKEND
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
                    <input type="text" className="login-input" placeholder="Usuario" value={user} onChange={(e) => {setUser(e.target.value)}} />
                    <input type="password" className="login-input" placeholder="Contraseña" value={password} onChange={(e) => (setPassword(e.target.value))} />
                    <button className="login-button" type="submit">Iniciar Sesión</button>
                </form>
                
                {/* Opciones adicionales */}
                <div className="login-links">
                    <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                    <span className="separator">|</span>
                    <a href="#" className="register-link">Registrarse</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
