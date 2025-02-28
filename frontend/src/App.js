
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; 
import Login from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/categorie/:categoryId" element={<HomePage />} />
        <Route path="/categorie/:categoryId/sous-categorie/:subCategoryId" element={<HomePage />} />
        <Route path="/vendre" element={<HomePage />} /> {/* ✅ Gérer la vente sur HomePage */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

