
import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import { AiOutlineCheckCircle } from "react-icons/ai"; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${server}/user/login-user`,
        { email, password },
        { withCredentials: true }
      );
      toast.success("Connexion réussie !", {
        icon: () => <AiOutlineCheckCircle color="#8B5E3C" size={22} />,
      });
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur inconnue. Veuillez réessayer.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative px-4">
      {/* Arrière-plan semi-transparent */}
      <div className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0 before:bg-black/5 before:backdrop-blur-md"
     style={{ backgroundImage: "url('/boutique_clothing_store.jpg')" }}>
</div>


      {/* Conteneur principal */}
      <div className="relative z-10 flex flex-col md:flex-row w-full md:w-[800px] h-auto md:h-[75vh] bg-white shadow-lg rounded-lg overflow-hidden">

        {/* Partie gauche : Image (Masquée sur mobile) */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center"
             style={{ backgroundImage: "url('/boutique_clothing_store.jpg')" }}>
        </div>

        {/* Partie droite : Formulaire */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-10">
          {/* ✅ Texte d’accroche amélioré */}
          <h2 className="text-lg font-medium text-[#6D4C41] text-center mb-6 leading-relaxed">
  Seconde main, premier choix <br />
  <span className="text-[#8B5E3C] font-normal">Connectez-vous à votre espace Rewear</span>
</h2>


          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#B8AFA6] rounded-md bg-[#F5F3EE] focus:ring-[#8d694e] focus:border-[#8B5E3C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#B8AFA6] rounded-md bg-[#F5F3EE] focus:ring-[#8d694e] focus:border-[#8B5E3C] focus:outline-none"
                />
                {visible ? (
                  <AiOutlineEye className="absolute right-3 top-3 cursor-pointer text-[#8B5E3C]" size={20} onClick={() => setVisible(false)} />
                ) : (
                  <AiOutlineEyeInvisible className="absolute right-3 top-3 cursor-pointer text-[#8B5E3C]" size={20} onClick={() => setVisible(true)} />
                )}
              </div>
            </div>

            {/* ✅ Bouton stylisé */}
            <button 
              type="submit" 
              className="w-full py-3 bg-[#C7B8A6] text-[#5A4637] font-semibold rounded-md hover:bg-[#B5A89C] transition">
              Se connecter
            </button>
          </form>

          {/* ✅ Lien vers l’inscription mieux espacé */}
          <p className="text-center text-gray-700 mt-5">
            Pas encore de compte ? <Link to="/sign-up" className="text-[#8B5E3C] font-normal">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

