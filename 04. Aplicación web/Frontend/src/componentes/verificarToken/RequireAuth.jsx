import { Navigate, Outlet } from "react-router-dom";
import { esTokenValido } from "./verificarJWT.jsx";
import Layout from "../Layout/Layout.jsx";

const RequireAuth = () => {
    return esTokenValido() ? <Layout /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
