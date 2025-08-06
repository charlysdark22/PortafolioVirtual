import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <BookOpen className="w-10 h-10 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">ScholarHub</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Crear Cuenta
          </h2>
          <p className="text-gray-600">
            Únete a la comunidad académica
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-center text-gray-600 mb-4">
            Página de registro en desarrollo
          </p>
          <div className="text-center">
            <Link 
              to="/auth/login" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;