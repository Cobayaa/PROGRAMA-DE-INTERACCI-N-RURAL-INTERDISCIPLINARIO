import { useState, useEffect } from 'react';
import Uniputumayo1 from "../assets/imgs/itp.png"
import Uniputumayo2 from "../assets/imgs/uniputumayo.jpg"
import "../index.css";

const Slider = ({ slides, autoPlay = true, interval = 8000 }) => {
  const defaultSlides = [
    {
      image: Uniputumayo1,
    },
    {
      image: Uniputumayo2,
    }
  ];

  const slidesData = slides || defaultSlides;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
  };

  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  return (
    <div className="relative w-full font-Raleway h-screen overflow-hidden">
      {slidesData.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative h-full flex items-center px-4 sm:px-6 md:px-12 lg:px-20">
            <div className="max-w-2xl">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-4">
                PIRI
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white">
                PROGRAMA INTERDISCIPLINARIO
              </p>
              <p className="text-lg sm:text-xl md:text-2xl text-white mt-1">
                RURAL DE INTERACCIÓN
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;