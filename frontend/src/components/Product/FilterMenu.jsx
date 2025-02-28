import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";

const FilterMenu = ({ filters = {}, setFilters }) => {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // ✅ Gérer les changements de filtres
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // ✅ Gérer le prix
    const handlePriceChange = () => {
        setFilters({ ...filters, minPrice, maxPrice });
    };

    return (
        <div className="w-full flex flex-wrap items-center gap-2 py-4 px-4 border-b bg-white shadow-sm relative z-50">
            
            {/* ✅ Taille */}
            <select name="size" value={filters.size || ""} onChange={handleFilterChange} className="border rounded-full px-4 py-2">
                <option value="">Taille</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
            </select>

            {/* ✅ Marque */}
            <select name="marque" value={filters.marque || ""} onChange={handleFilterChange} className="border rounded-full px-4 py-2">
                <option value="">Marque</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Zara">Zara</option>
                <option value="Kiabi">Kiabi</option>
                <option value="Autre">Autre</option>
            </select>

            {/* ✅ État */}
            <select name="condition" value={filters.condition || ""} onChange={handleFilterChange} className="border rounded-full px-4 py-2">
                <option value="">État</option>
                <option value="Neuf">Neuf</option>
                <option value="Bon état">Bon état</option>
                <option value="Usé">Usé</option>
            </select>

            {/* ✅ Matière */}
            <select name="material" value={filters.material || ""} onChange={handleFilterChange} className="border rounded-full px-4 py-2">
                <option value="">Matière</option>
                <option value="Coton">Coton</option>
                <option value="Cuir">Cuir</option>
                <option value="Polyester">Polyester</option>
                <option value="Synthétique">Synthétique</option>
                <option value="Denim">Denim</option>
            </select>

            {/* ✅ Couleur */}
            <select name="color" value={filters.color || ""} onChange={handleFilterChange} className="border rounded-full px-4 py-2">
                <option value="">Couleur</option>
                <option value="Noir">Noir</option>
                <option value="Blanc">Blanc</option>
                <option value="Rouge">Rouge</option>
                <option value="Bleu">Bleu</option>
                <option value="Rose">Rose</option>
                <option value="Gris">Gris</option>
                <option value="Multicolors">Multicolors</option>
            </select>

            {/* ✅ Prix */}
            <input type="number" placeholder="Prix min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="border rounded-full px-4 py-2 w-24" />
            <input type="number" placeholder="Prix max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="border rounded-full px-4 py-2 w-24" />
            <button onClick={handlePriceChange} className="bg-blue-500 text-white px-4 py-2 rounded-full">Filtrer</button>

            {/* ✅ Filtres sélectionnés */}
            {Object.entries(filters).map(([key, value]) =>
                value ? (
                    <div key={key} className="bg-gray-200 rounded-full px-4 py-2 flex items-center text-sm">
                        {value}
                        <button onClick={() => setFilters({ ...filters, [key]: "" })} className="ml-2 text-gray-500">
                            <IoIosClose size={16} />
                        </button>
                    </div>
                ) : null
            )}

            {/* ✅ Effacer tous les filtres */}
            <button onClick={() => setFilters({})} className="text-blue-600 text-sm ml-auto">
                Effacer les filtres
            </button>
        </div>
    );
};

export default FilterMenu;
