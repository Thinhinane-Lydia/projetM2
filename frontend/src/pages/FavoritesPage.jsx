import React, { useState } from 'react';
import Favoris from "../components/Favoris/Favoris";
import Header from "../components/Layout/Header";

const FavoritesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="pt-24 pb-12 min-h-screen bg-amber-50/30">
      <Header 
        showCategories={false}
        setSearchTerm={setSearchTerm} 
      />
      
      <div className="mt-8">
        <Favoris searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default FavoritesPage;
