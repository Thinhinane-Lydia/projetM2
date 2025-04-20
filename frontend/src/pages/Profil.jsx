import React, { useState } from "react";
import Header from "../components/Layout/Header";

import InfoPers from "../components/profil/InfoPers";
import MaBoutique from "../components/profil/MaBoutique";
import MesVentes from "../components/profil/MesVentes";
import MesAchats from "../components/profil/MesAchats";
import Footer from '../components/Layout/Footer';

const Profil = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("boutique"); // "boutique", "ventes" ou "achats"

    return (
        <div className="pt-24 pb-12 min-h-screen bg-amber-50/30">
            <Header showCategories={false} setSearchTerm={setSearchTerm} />
            
            <div className="container mx-auto px-4 mt-16">
                <h1 className="text-2xl font-bold text-amber-800 mb-6 px-6">Mon Profil</h1>
                <InfoPers />
                
                <div className="mt-10">
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-amber-200 mb-6">
                        <button 
                            className={`px-6 py-3 font-medium text-lg transition-colors duration-200 ${
                                activeTab === "boutique" 
                                ? "text-amber-800 border-b-2 border-amber-600" 
                                : "text-gray-600 hover:text-amber-700"
                            }`}
                            onClick={() => setActiveTab("boutique")}
                        >
                            Ma Boutique
                        </button>
                        <button 
                            className={`px-6 py-3 font-medium text-lg transition-colors duration-200 ${
                                activeTab === "ventes" 
                                ? "text-green-800 border-b-2 border-green-600" 
                                : "text-gray-600 hover:text-green-700"
                            }`}
                            onClick={() => setActiveTab("ventes")}
                        >
                            Mes Ventes
                        </button>
                        <button 
    className={`px-6 py-3 font-medium text-lg transition-colors duration-200 ${
        activeTab === "achats" 
        ? "text-orange-800 border-b-2 border-orange-600" 
        : "text-gray-600 hover:text-orange-700"
    }`}
    onClick={() => setActiveTab("achats")}
>
    Mes Achats
</button>
                    </div>
                    
                    {/* Tab Content */}
                    {activeTab === "boutique" ? (
                        <MaBoutique searchTerm={searchTerm} />
                    ) : activeTab === "ventes" ? (
                        <MesVentes searchTerm={searchTerm} />
                    ) : (
                        <MesAchats searchTerm={searchTerm} />
                    )}
                </div>
            </div>
            
            {/* Ajout du Footer */}
            <Footer />
        </div>
    );
};

export default Profil;