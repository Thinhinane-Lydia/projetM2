
import React, { useState } from "react";
import Header from "../components/Layout/Header";
import SellForm from "../components/Sell/SellForm";
import Footer from '../components/Layout/Footer';
const SellPage = () => {
    const [searchTerm, setSearchTerm] = useState(""); // ✅ Ajout de l'état

    return (
        <div className="pt-32">
            {/* ✅ On passe bien setSearchTerm pour éviter l'erreur */}
            <Header showCategories={false} setSearchTerm={setSearchTerm} showAdCarousel={false} />
             
            <div className="flex justify-center items-center mt-10 mb-8">
                <SellForm onSubmit={(data) => console.log("Données soumises :", data)} />
            </div>
              {/* Ajout du Footer */}
      <Footer />
        </div>
    );
};

export default SellPage;
