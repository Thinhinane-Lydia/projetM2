// import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import ban from "../../Assests/ban.jpg";
// import homme from "../../Assests/homme.jpg";
// import enfant from "../../Assests/en.jpg";
// import { Link } from "react-router-dom";

// const AdCarousel = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);

//   const slides = [
//     {
//       image: ban,
//       title: "REWEAR",
//       description: "Seconde main, premier style",
//       buttonText: "Commencer à vendre",
//       buttonLink: "/Sell",
//     },
//     {
//       image: homme,
//       title: "NOUVEAUTÉS HOMMES",
//       description: "Découvrez notre collection masculine",
//       buttonText: "Explorer",
//       buttonLink: "/category/homme",
//     },
//     {
//       image: enfant,
//       title: "COIN DES ENFANTS",
//       description: "Des vêtements de qualité pour vos petits",
//       buttonText: "Voir la collection",
//       buttonLink: "/category/enfant",
//     },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 6000);
//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   const nextSlide = () => {
//     if (!isAnimating) {
//       setIsAnimating(true);
//       setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
//       setTimeout(() => setIsAnimating(false), 500);
//     }
//   };

//   const prevSlide = () => {
//     if (!isAnimating) {
//       setIsAnimating(true);
//       setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
//       setTimeout(() => setIsAnimating(false), 500);
//     }
//   };

//   const goToSlide = (slideIndex) => {
//     if (!isAnimating && slideIndex !== currentIndex) {
//       setIsAnimating(true);
//       setCurrentIndex(slideIndex);
//       setTimeout(() => setIsAnimating(false), 500);
//     }
//   };

//   return (
//     <div className="relative w-full overflow-hidden bg-gray-50 mt-6 mb-2">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
//           {/* Carousel slides */}
//           <div className="absolute inset-0 w-full h-full flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
//             {slides.map((slide, index) => (
//               <div key={index} className="min-w-full h-full relative flex-shrink-0">
//                 <img
//                   src={slide.image}
//                   alt={slide.title}
//                   className="w-full h-full object-cover object-center"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
//                   <div className="text-white ml-8 md:ml-16 max-w-md p-4 md:p-0 transform transition-all duration-700 translate-y-0" style={{ opacity: index === currentIndex ? 1 : 0 }}>
//                     <h2 className="text-3xl md:text-4xl font-bold mb-2">{slide.title}</h2>
//                     <p className="text-lg md:text-xl mb-6">{slide.description}</p>
//                     <Link to={slide.buttonLink}>
//                       <button className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
//                         {slide.buttonText}
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Navigation arrows */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
//             aria-label="Previous slide"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
//             aria-label="Next slide"
//           >
//             <ChevronRight size={24} />
//           </button>

//           {/* Dots indicators */}
//           <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                   currentIndex === index ? "bg-amber-500 w-6" : "bg-white/60 hover:bg-white"
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdCarousel;

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ban from "../../Assests/ban.jpg";
import homme from "../../Assests/homme.jpg";
import enfant from "../../Assests/en.jpg";
import { Link } from "react-router-dom";

const ModernAdCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const carouselRef = useRef(null);

  const slides = [
    {
      image: ban,
      title: "REWEAR",
      description: "Seconde main, premier style",
      buttonText: "Commencer à vendre",
      buttonLink: "/Sell",
    },
    {
      image: homme,
      title: "NOUVEAUTÉS HOMMES",
      description: "Faites place à la nouveauté sans vider votre porte-monnaie",
      buttonText: "Explorer",
      buttonLink: "/category/homme",
    },
    {
      image: enfant,
      title: "COIN DES ENFANTS",
      description: "De jolis vêtements de qualité, à prix malin, pour vos enfants.",
      buttonText: "Voir la collection",
      buttonLink: "/category/enfant",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideChange('next');
    }, 7000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleSlideChange = (dir) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(dir);
    
    if (dir === 'next') {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    } else {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    }
    
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToSlide = (slideIndex) => {
    if (isAnimating || slideIndex === currentIndex) return;
    
    setIsAnimating(true);
    setDirection(slideIndex > currentIndex ? 'next' : 'prev');
    setCurrentIndex(slideIndex);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const getSlidePosition = (index) => {
    if (index === currentIndex) return "translate-x-0 z-20 opacity-100";
    if (direction === 'next' && (index === currentIndex - 1 || (currentIndex === 0 && index === slides.length - 1))) {
      return "-translate-x-full z-10 opacity-0";
    }
    if (direction === 'prev' && (index === currentIndex + 1 || (currentIndex === slides.length - 1 && index === 0))) {
      return "translate-x-full z-10 opacity-0";
    }
    return "translate-x-full z-0 opacity-0";
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-50  mt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={carouselRef}
          className="relative h-96 md:h-[400px] rounded-lg overflow-hidden"
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
          
          {/* Slides */}
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${getSlidePosition(index)}`}
            >
              {/* Image container with parallax effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-10000 ease-out scale-105 hover:scale-100"
                />
              </div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center z-20">
                <div className="w-full max-w-7xl mx-auto px-8 md:px-16">
                  <div className={`max-w-md transition-all duration-700 delay-100 transform ${
                    index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white tracking-tight">{slide.title}</h2>
                    <div className="w-16 h-1 bg-amber-500 mb-6 transform transition-all duration-700 ease-out"></div>
                  
                    <p className="text-xl text-white mb-8 font-semibold">{slide.description}</p>
                    <Link to={slide.buttonLink}>
                      <button className="group relative overflow-hidden bg-white text-gray-900 py-3 px-8 rounded-none font-medium transition-all duration-300">
                        <span className="relative z-10">{slide.buttonText}</span>
                        <span className="absolute inset-0 bg-amber-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation arrows */}
          <button
            onClick={() => handleSlideChange('prev')}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white border border-white/30 hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Slide précédente"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => handleSlideChange('next')}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white border border-white/30 hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Slide suivante"
          >
            <ChevronRight size={24} />
          </button>

          {/* Progress indicator */}
          <div className="absolute bottom-8 left-8 md:left-16 z-30 flex items-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group flex items-center mr-4"
                aria-label={`Aller à la slide ${index + 1}`}
              >
                <div className={`w-12 h-[2px] transition-all duration-500 ${
                  currentIndex === index ? "bg-white w-12" : "bg-white/40 group-hover:bg-white/70 w-8"
                }`} />
                <span className={`ml-2 text-xs font-medium transition-opacity duration-300 ${
                  currentIndex === index ? "text-white opacity-100" : "text-white/40 group-hover:text-white/70 opacity-0 group-hover:opacity-100"
                }`}>0{index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAdCarousel;