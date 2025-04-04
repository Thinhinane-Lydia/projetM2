
import React, { useState } from "react";
import Header from "../components/Layout/Header";

import InfoPers from "../components/profil/InfoPers";
import MaBoutique from "../components/profil/MaBoutique";
import Footer from '../components/Layout/Footer';
const Profil = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="pt-24 pb-12 min-h-screen bg-amber-50/30">
            <Header showCategories={false} setSearchTerm={setSearchTerm} />
            
            <div className="container mx-auto px-4 mt-8">
                <h1 className="text-2xl font-bold text-amber-800 mb-6 px-6">Mon Profil</h1>
                <InfoPers />
                <div className="mt-10">
                    <MaBoutique searchTerm={searchTerm} />
                </div>
            </div>
              {/* Ajout du Footer */}
      <Footer />
        </div>
    );
};

export default Profil;