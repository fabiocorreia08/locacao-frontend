import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Se não houver token, redireciona
  if (!token || token.split(".").length !== 3) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const isExpired = decodedPayload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.warn("Token inválido:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}