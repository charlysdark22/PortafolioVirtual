import React from 'react';

const Articles: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mis Artículos
        </h1>
        <p className="text-gray-600">
          Gestiona todas tus publicaciones académicas.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-center text-gray-600">
          Página de artículos en desarrollo...
        </p>
      </div>
    </div>
  );
};

export default Articles;