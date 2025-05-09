import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import ProductDetail from '../components/InfoProduct/ProductDetail';
import SimilarProducts from '../components/InfoProduct/SimilarProducts';

import { useParams } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
const InfoProductPage = () => {
  const { productId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [product, setProduct] = useState(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        showCategories={false} 
        showAdCarousel={false}
        setSearchTerm={setSearchTerm}
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        setIsVisible={setIsVisible}
      />
      <div className="mt-32 flex-grow w-full">
        <ProductDetail productId={productId} onProductLoaded={setProduct} />

        {product && (
          <SimilarProducts
            currentProductId={product._id}
            category={product.category}
            subCategory={product.subCategory}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default InfoProductPage;