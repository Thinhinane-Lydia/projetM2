import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Activation en cours...");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const sendRequest = async () => {
        console.log("🔄 Envoi de la requête d'activation...");
        try {
          const res = await axios.get(`${server}/user/activation/${token}`);
          console.log("✅ Réponse reçue :", res);
          setMessage("🎉 Votre compte a été activé avec succès ! Redirection...");
          setTimeout(() => navigate("/login"), 3000); // ✅ Redirection après 3 secondes
        } catch (err) {
          console.error("❌ Erreur d'activation :", err.response?.data?.message || err);
          setMessage("❌ Le lien d'activation a expiré ou est invalide.");
        }
      };
      sendRequest();
    }
  }, [token, navigate]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default ActivationPage;
