
import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import ProductDetail from '../components/InfoProduct/ProductDetail';
import { useParams } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
const InfoProductPage = () => {
  const { productId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div>
      <Header 
        showCategories={false} 
        setSearchTerm={setSearchTerm}
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        setIsVisible={setIsVisible}
      />
      <div className="mt-32"> {/* Add margin-top to account for fixed header */}
        <ProductDetail productId={productId} />
      </div>

      {/* Ajout du Footer */}
      <Footer />
    </div>


    
  );
}

export default InfoProductPage;