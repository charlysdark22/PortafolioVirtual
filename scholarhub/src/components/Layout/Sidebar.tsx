import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  Search, 
  Heart, 
  BarChart3,
  Users,
  Settings,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../hooks';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, className }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard',
    },
    {
      name: 'Mis Artículos',
      href: '/dashboard/articles',
      icon: FileText,
      current: location.pathname === '/dashboard/articles',
    },
    {
      name: 'Nuevo Artículo',
      href: '/dashboard/articles/new',
      icon: PlusCircle,
      current: location.pathname === '/dashboard/articles/new',
    },
    {
      name: 'Buscar',
      href: '/search',
      icon: Search,
      current: location.pathname === '/search',
    },
    {
      name: 'Favoritos',
      href: '/dashboard/favorites',
      icon: Heart,
      current: location.pathname === '/dashboard/favorites',
    },
  ];

  const adminItems = [
    {
      name: 'Panel Admin',
      href: '/admin',
      icon: BarChart3,
      current: location.pathname === '/admin',
    },
    {
      name: 'Gestionar Usuarios',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users',
    },
  ];

  const settingsItems = [
    {
      name: 'Configuración',
      href: '/dashboard/settings',
      icon: Settings,
      current: location.pathname === '/dashboard/settings',
    },
  ];

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 lg:static lg:inset-auto lg:translate-x-0",
      className
    )}
    style={{ top: '4rem' }}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    item.current
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={clsx(
                      'mr-3 h-5 w-5 transition-colors',
                      item.current
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="pt-6">
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administración
                </h3>
              </div>
              <div className="space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={clsx(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        item.current
                          ? 'bg-accent-100 text-accent-700 border-r-2 border-accent-600'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Icon
                        className={clsx(
                          'mr-3 h-5 w-5 transition-colors',
                          item.current
                            ? 'text-accent-600'
                            : 'text-gray-400 group-hover:text-gray-600'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settings Section */}
          <div className="pt-6">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Configuración
              </h3>
            </div>
            <div className="space-y-1">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      item.current
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'mr-3 h-5 w-5 transition-colors',
                        item.current
                          ? 'text-gray-600'
                          : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <div>
              <p className="font-medium">ScholarHub</p>
              <p className="text-xs">Plataforma Académica</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-30"
          onClick={() => {/* This will be handled by parent component */}}
        />
      )}
    </aside>
  );
};

export default Sidebar;