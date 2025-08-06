import React from 'react';
import { FileText, Plus, Search, Heart, Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Artículos Publicados', value: '12', icon: FileText, color: 'text-blue-600' },
    { name: 'Total Vistas', value: '1,423', icon: Eye, color: 'text-green-600' },
    { name: 'Descargas', value: '342', icon: Download, color: 'text-purple-600' },
    { name: 'Favoritos', value: '28', icon: Heart, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Bienvenido/a, {user?.fullName}!
        </h1>
        <p className="text-gray-600">
          Gestiona tus publicaciones académicas desde tu panel de control.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/dashboard/articles/new"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Plus className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Nuevo Artículo</h3>
              <p className="text-sm text-gray-500">Crear una nueva publicación</p>
            </div>
          </Link>

          <Link 
            to="/search"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Search className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Buscar Artículos</h3>
              <p className="text-sm text-gray-500">Explorar publicaciones</p>
            </div>
          </Link>

          <Link 
            to="/dashboard/articles"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <FileText className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Mis Artículos</h3>
              <p className="text-sm text-gray-500">Gestionar publicaciones</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Artículos Recientes</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              Inteligencia Artificial en la Educación Superior
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Última modificación: hace 2 días
            </p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>250 vistas</span>
              <span>45 descargas</span>
              <span>Publicado</span>
            </div>
          </div>
          
          <div className="text-center py-4">
            <Link 
              to="/dashboard/articles" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Ver todos los artículos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;