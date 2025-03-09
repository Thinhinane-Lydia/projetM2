import React from "react";
import Header from "../components/Layout/Header";
import SellForm from "../components/Sell/SellForm"; // ✅ Import du formulaire

const SellPage = () => {
    return (
        <div className="pt-32"> {/* ✅ Garder le header fixe */}
            <Header /> {/* ✅ Garder la barre de navigation en haut */}
            
            {/* ✅ Afficher le formulaire à la place de la liste des produits */}
            <div className="flex justify-center items-center mt-6">
                <SellForm onSubmit={(data) => console.log("Données soumises :", data)} />
            </div>
        </div>
    );
};

export default SellPage;
