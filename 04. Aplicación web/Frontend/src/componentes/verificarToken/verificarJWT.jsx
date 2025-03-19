import { jwtDecode } from "jwt-decode";

export const esTokenValido = () => {
    const token = localStorage.getItem("token");

    if (!token) return false; // Si no hay token, no es válido

    try {
        const { exp } = jwtDecode(token);
        const ahora = Date.now() / 1000; //Convertimos milisegundos a segundos

        if (exp < ahora) {
            localStorage.removeItem("token"); // Eliminar el token si ha expirado
            return false;
        }

        return true;
    } catch (error) {
        localStorage.removeItem("token"); // Si el token es inválido, lo eliminamos también
        return false;
    }
};