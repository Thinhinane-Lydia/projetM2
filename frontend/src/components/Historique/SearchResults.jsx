import React, { useState, useEffect } from 'react';
import { fetchSearchHistory } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Centralized image URL handling function
  const getImageUrl = (product) => {
    const images = product.images;
    
    console.log("🔍 Product:", product);
    console.log("🖼️ Images received:", images);
    
    if (!images || images.length === 0) {
      console.warn("No images found for product");
      return "/placeholder-product.png";
    }

    try {
      const firstImage = images[0];
      console.log("First image:", firstImage);

      // More detailed logging
      if (typeof firstImage === 'object') {
        console.log("Image object keys:", Object.keys(firstImage));
        console.log("Image URL:", firstImage.url);
      }

      const imageUrl = typeof firstImage === 'object' 
        ? (firstImage.url || firstImage.path || '/placeholder-product.png')
        : firstImage;

      console.log("Processed image URL:", imageUrl);

      // Ensure full URL construction
      if (imageUrl.startsWith('http')) return imageUrl;
      return `http://localhost:8000/${imageUrl.replace(/^\//, '')}`;

    } catch (error) {
      console.error("Error processing image:", error);
      return "/placeholder-product.png";
    }
  };

  // Rest of the component remains the same as in your original code
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        setLoading(true);
        const data = await fetchSearchHistory();
        
        if (data.success) {
          // Flatten all products from search history
          const flattenedProducts = data.searchHistory.reduce((acc, historyItem) => {
            if (historyItem.products && historyItem.products.length > 0) {
              return [...acc, ...historyItem.products];
            }
            return acc;
          }, []);

          // Remove duplicates
          const uniqueProducts = Array.from(
            new Map(flattenedProducts.map(product => [product._id, product]))
            .values()
          );

          setAllProducts(uniqueProducts);
        } else {
          setError("Aucun historique trouvé.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'historique des recherches:", err);
        setError("Impossible de charger l'historique des recherches.");
      } finally {
        setLoading(false);
      }
    };

    loadSearchHistory();
  }, []);

  // Rest of the component remains the same...

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Tous les produits des recherches précédentes
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {allProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <img
              src={getImageUrl(product)}  // Pass entire product object
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 truncate mb-2">
                {product.name}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {product.price} DA
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;