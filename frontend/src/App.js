import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, SignupPage, ActivationPage, HomePage,FavoritesPage,CartPage } from "./Routes";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./components/cart/Cart";
import MessagesPage from './pages/MessagesPage';
import PrivateRoute from "./components/PrivateRoute";


 


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
        <Route path="/vendre" element={<HomePage />} />
        {/* ✅ Gérer la vente sur HomePage */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/activation-success" element={<ActivationPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/cart" element={<CartPage />} />
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
