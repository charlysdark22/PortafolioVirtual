import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppSelector } from '../../hooks';

const Layout: React.FC = () => {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {isAuthenticated && (
          <Sidebar 
            isOpen={sidebarOpen} 
            className={`transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}
          />
        )}
        
        <main 
          className={`flex-1 transition-all duration-300 ${
            isAuthenticated 
              ? sidebarOpen 
                ? 'lg:ml-64' 
                : 'lg:ml-64' 
              : ''
          }`}
          style={{ paddingTop: '4rem' }}
        >
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;