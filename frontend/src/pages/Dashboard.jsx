import React from 'react';
import { useAuthApi } from '../Api/AuthApi.js';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuthApi();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Bienvenido, {user?.name} 👋
          </h2>
          
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Rol:</span> {user?.role === 'admin' ? 'Administrador' : 'Colaborador'}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Estado:</span>{' '}
              <span className="text-green-600">✓ Cuenta activa</span>
            </p>
          </div>

          {/* Panel de Administrador */}
          {user?.role === 'admin' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                👑 Panel de Administrador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link 
                  to="/cms/usuarios"
                  className="bg-white p-3 rounded-lg border border-blue-200 hover:shadow-md transition"
                >
                  <div className="font-semibold text-blue-800">👥 Usuarios</div>
                  <p className="text-sm text-blue-600">Activar cuentas, cambiar roles</p>
                </Link>
                <Link 
                  to="/cms/contenido"
                  className="bg-white p-3 rounded-lg border border-blue-200 hover:shadow-md transition"
                >
                  <div className="font-semibold text-blue-800">📝 Contenido</div>
                  <p className="text-sm text-blue-600">Editar páginas (Inicio, Quiénes Somos, etc.)</p>
                </Link>
                <Link 
                  to="/cms/noticias"
                  className="bg-white p-3 rounded-lg border border-blue-200 hover:shadow-md transition"
                >
                  <div className="font-semibold text-blue-800">📰 Noticias</div>
                  <p className="text-sm text-blue-600">Crear, editar y publicar noticias</p>
                </Link>
                <Link 
                  to="/cms/contacto"
                  className="bg-white p-3 rounded-lg border border-blue-200 hover:shadow-md transition"
                >
                  <div className="font-semibold text-blue-800">📞 Contacto</div>
                  <p className="text-sm text-blue-600">Editar información de contacto</p>
                </Link>
              </div>
            </div>
          )}

          {user?.role === 'user' && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                🤝 Panel de Colaborador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link 
                  to="/cms/contenido"
                  className="bg-white p-3 rounded-lg border border-green-200 hover:shadow-md transition"
                >
                  <div className="font-semibold text-green-800">📝 Contenido</div>
                  <p className="text-sm text-green-600">Editar páginas (Inicio, Quiénes Somos, etc.)</p>
                </Link>
                <Link 
                  to="/cms/noticias"
                  className="bg-white p-3 rounded-lg border border-green-200 hover:shadow-md transition"
                >
                  <div className="font-semibold text-green-800">📰 Noticias</div>
                  <p className="text-sm text-green-600">Crear, editar y publicar noticias</p>
                </Link>
                <Link 
                  to="/cms/contacto"
                  className="bg-white p-3 rounded-lg border border-green-200 hover:shadow-md transition"
                >
                  <div className="font-semibold text-green-800">📞 Contacto</div>
                  <p className="text-sm text-green-600">Editar información de contacto</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;