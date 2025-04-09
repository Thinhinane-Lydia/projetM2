import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./components/cart/Cart";
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmation'; 


import PrivateRoute from "./components/PrivateRoute";
 
import {
  Login,
  SignupPage,
  ActivationPage,
  HomePage,
  SellPage,
  Profil,
  InfoProdcutPage,
  HistoriquePage,
  ProfileEditPage,
  AdminPage,
  FavoritesPage,
  CartPage ,
  MessagesPage,
  
} from "./Routes";

 



const App = () => {
  return (
    <CartProvider>

   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categorie/:categoryId" element={<HomePage />} />
        <Route
          path="/categorie/:categoryId/sous-categorie/:subCategoryId"
          element={<HomePage />}
        />
        
        {/* ✅ Gérer la vente sur HomePage */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/activation-success" element={<ActivationPage />} />
        <Route path="/Sell/:id?" element={<SellPage />} />

        <Route path="/Profil" element={<Profil />} />

        <Route path="/InfoProduct/:productId" element={<InfoProdcutPage />} />
        <Route path="/Historique" element={<HistoriquePage />} />
        <Route path="/Edit" element={<ProfileEditPage />} />
        <Route path="/Admin" element={<AdminPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
       
        <Route path="/OrderConfirmation" element={<OrderConfirmationPage />} />
      
        <Route 
  path="/messages/*" 
  element={<PrivateRoute><MessagesPage /></PrivateRoute>}
/>

      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
    </CartProvider>
  );
};

export default App;
