import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from "../assets/imgs/logo.png"
import "../index.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Acerca de', path: '/about' },
    { name: 'Quiénes somos', path: '/quienes_somos' },
    { name: 'Convenio', path: '/convenio' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Contacto', path: '/contacto' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 font-Raleway sticky top-0 z-50">
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center shrink-0">
            <img 
              src={Logo} 
              alt="Logo" 
              className="h-20 p-0 m-0 w-auto object-contain pointer-events-none"
            />
          </div>

          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-black"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-none transition-colors duration-200"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div 
          className={`md:hidden overflow-hidden transition-all duration-200 ease-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-3 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;