import { useAuthApi } from '../Api/AuthApi.js';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, 
  Users, 
  FileText, 
  Newspaper, 
  Phone, 
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuthApi();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = {
    admin: [
      { icon: Users, label: "Usuarios", path: "/cms/usuarios", desc: "Activar cuentas, cambiar roles", color: "blue" },
      { icon: FileText, label: "Contenido", path: "/cms/contenido", desc: "Editar páginas del sitio", color: "purple" },
      { icon: Newspaper, label: "Noticias", path: "/cms/noticias", desc: "Crear y gestionar noticias", color: "green" },
      { icon: Phone, label: "Contacto", path: "/cms/contacto", desc: "Editar información de contacto", color: "orange" }
    ],
    user: [
      { icon: FileText, label: "Contenido", path: "/cms/contenido", desc: "Editar páginas del sitio", color: "purple" },
      { icon: Newspaper, label: "Noticias", path: "/cms/noticias", desc: "Crear y gestionar noticias", color: "green" },
      { icon: Phone, label: "Contacto", path: "/cms/contacto", desc: "Editar información de contacto", color: "orange" }
    ]
  };

  const currentMenu = user?.role === 'admin' ? menuItems.admin : menuItems.user;

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: "bg-gray-50", border: "border-gray-200", icon: "text-gray-600"},
      purple: { bg: "bg-gray-50", border: "border-gray-200", icon: "text-gray-600"},
      green: { bg: "bg-gray-50", border: "border-gray-200", icon: "text-gray-600"},
      orange: { bg: "bg-gray-50", border: "border-gray-200", icon: "text-gray-600"}
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-left">
              <h2 className="text-2xl font-semibold text-gray-900">Bienvenido, {user?.name}</h2>
              <span className="text-sm text-gray-600">{user?.email}</span>
               <span className="text-sm text-gray-600">{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMenu.map((item, idx) => {
            const Icon = item.icon;
            const colors = getColorClasses(item.color);
            return (
              <Link
                key={idx}
                to={item.path}
                className={`group ${colors.bg} border ${colors.border} rounded-xl p-6`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.icon}`}>{item.label}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${colors.icon} opacity-75 transition-opacity`} />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;