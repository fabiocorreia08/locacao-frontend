import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import ImovelList from "../pages/imovel/ImovelList";
import ImovelForm from "../pages/imovel/ImovelForm";
import ImovelEditar from "../pages/imovel/ImovelEditar";
import ImovelDetalhar from "../pages/imovel/ImovelDetalhar";

import LocadorList from "../pages/locador/LocadorList";
import LocadorForm from "../pages/locador/LocadorForm";
import LocadorEditar from "../pages/locador/LocadorEditar";
import LocadorDetalhar from "../pages/locador/LocadorDetalhar";

import LocatarioList from "../pages/locatario/LocatarioList";
import LocatarioForm from "../pages/locatario/LocatarioForm";
import LocatarioEditar from "../pages/locatario/LocatarioEditar";
import LocatarioDetalhar from "../pages/locatario/LocatarioDetalhar";

import LocacaoList from "../pages/locacao/LocacaoList";
import LocacaoForm from "../pages/locacao/LocacaoForm";
import LocacaoEditar from "../pages/locacao/LocacaoEditar";
import LocacaoDetalhar from "../pages/locacao/LocacaoDetalhar";

import Login from "../pages/login/Login";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />

    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

    {/* Imóvel */}
    <Route path="/imovel" element={<ProtectedRoute><ImovelList /></ProtectedRoute>} />
    <Route path="/imovel/novo" element={<ProtectedRoute><ImovelForm /></ProtectedRoute>} />
    <Route path="/imovel/editar/:id" element={<ProtectedRoute><ImovelEditar /></ProtectedRoute>} />
    <Route path="/imovel/detalhar/:id" element={<ProtectedRoute><ImovelDetalhar /></ProtectedRoute>} />

    {/* Locador */}
    <Route path="/locador" element={<ProtectedRoute><LocadorList /></ProtectedRoute>} />
    <Route path="/locador/novo" element={<ProtectedRoute><LocadorForm /></ProtectedRoute>} />
    <Route path="/locador/editar/:id" element={<ProtectedRoute><LocadorEditar /></ProtectedRoute>} />
    <Route path="/locador/detalhar/:id" element={<ProtectedRoute><LocadorDetalhar /></ProtectedRoute>} />

    {/* Locatário */}
    <Route path="/locatario" element={<ProtectedRoute><LocatarioList /></ProtectedRoute>} />
    <Route path="/locatario/novo" element={<ProtectedRoute><LocatarioForm /></ProtectedRoute>} />
    <Route path="/locatario/editar/:id" element={<ProtectedRoute><LocatarioEditar /></ProtectedRoute>} />
    <Route path="/locatario/detalhar/:id" element={<ProtectedRoute><LocatarioDetalhar /></ProtectedRoute>} />

    {/* Locação */}
    <Route path="/locacao" element={<ProtectedRoute><LocacaoList /></ProtectedRoute>} />
    <Route path="/locacao/novo" element={<ProtectedRoute><LocacaoForm /></ProtectedRoute>} />
    <Route path="/locacao/editar/:id" element={<ProtectedRoute><LocacaoEditar /></ProtectedRoute>} />
    <Route path="/locacao/detalhar/:id" element={<ProtectedRoute><LocacaoDetalhar /></ProtectedRoute>} />
  </Routes>
);

export default AppRoutes;