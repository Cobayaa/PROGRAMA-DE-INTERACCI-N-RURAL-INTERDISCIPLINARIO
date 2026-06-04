import { Link } from 'react-router-dom';
import { useAuthApi } from '../Api/AuthApi';
import Logo from "../assets/imgs/logo.png"

const Footer = () => {
  const { isAuthenticated } = useAuthApi();
  
  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Acerca de', path: '/about' },
    { name: 'Quiénes somos', path: '/quienes_somos' },
    { name: 'Convenio', path: '/convenio' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Contacto', path: '/contacto' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="w-full px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center shrink-0">
            <img 
              src={Logo} 
              alt="Logo" 
              className="h-60 rounded-full p-0 w-auto object-contain pointer-events-none"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-500 hover:text-gray-800 text-sm font-normal tracking-wide transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            
            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-gray-400 hover:text-gray-600 text-sm font-normal tracking-wide transition-colors duration-200 border-l border-gray-200 pl-8 ml-2"
              >
                Editor
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs tracking-wide">
            {new Date().getFullYear()} PIRI - Programa Interdisciplinario Rural de Interacción
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;