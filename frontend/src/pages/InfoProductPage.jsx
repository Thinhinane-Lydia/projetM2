
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


// import React, { useState } from 'react';
// import Header from '../components/Layout/Header';
// import ProductDetail from '../components/InfoProduct/ProductDetail';
// import { useParams, useLocation } from 'react-router-dom';
// import Footer from '../components/Layout/Footer';

// const InfoProductPage = () => {
//   const { productId } = useParams();
//   const location = useLocation();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [isVisible, setIsVisible] = useState(false);
  
//   // Vérifier si l'URL contient le paramètre isAdmin=true
//   const isAdminMode = new URLSearchParams(location.search).get('isAdmin') === 'true';
  
//   return (
//     <div>
//       {/* Afficher le Header uniquement en mode non-admin */}
//       {!isAdminMode && (
//         <Header 
//           showCategories={false} 
//           setSearchTerm={setSearchTerm}
//           setActiveCategory={setActiveCategory}
//           activeCategory={activeCategory}
//           setIsVisible={setIsVisible}
//         />
//       )}
      
//       {/* Ajuster la marge supérieure en fonction du mode */}
//       <div className={isAdminMode ? "pt-6" : "mt-32"}> 
//         <ProductDetail productId={productId} />
//       </div>

//       {/* Ajout du Footer seulement en mode non-admin */}
//       {!isAdminMode && <Footer />}
//     </div>
//   );
// }

// export default InfoProductPage;