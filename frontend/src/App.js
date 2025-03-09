import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, SignupPage, ActivationPage, HomePage } from "./Routes";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categorie/:categoryId" element={<HomePage />} />
        <Route
          path="/categorie/:categoryId/sous-categorie/:subCategoryId"
          element={<HomePage />}
        />
        <Route path="/vendre" element={<HomePage />} />{" "}
        {/* ✅ Gérer la vente sur HomePage */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/activation-success" element={<ActivationPage />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
