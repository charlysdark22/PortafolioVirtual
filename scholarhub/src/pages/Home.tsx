import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, FileText, Users, TrendingUp, Award } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenido a ScholarHub
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            La plataforma integral para la gestión de publicaciones académicas. 
            Publica, busca, gestiona y exporta artículos científicos de forma profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Comenzar Ahora
            </Link>
            <Link to="/search" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Explorar Artículos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades Principales
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre todas las herramientas que ScholarHub pone a tu disposición 
              para optimizar tu trabajo académico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card card-hover text-center">
              <FileText className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Editor Avanzado</h3>
              <p className="text-gray-600">
                Editor de texto enriquecido con soporte para fórmulas, tablas e imágenes.
              </p>
            </div>

            <div className="card card-hover text-center">
              <Search className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Búsqueda Avanzada</h3>
              <p className="text-gray-600">
                Busca artículos por autor, fecha, categoría y palabras clave de forma inteligente.
              </p>
            </div>

            <div className="card card-hover text-center">
              <BookOpen className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Exportación Múltiple</h3>
              <p className="text-gray-600">
                Exporta tus artículos a PDF, Word y genera citas en formato APA o BibTeX.
              </p>
            </div>

            <div className="card card-hover text-center">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Colaboración</h3>
              <p className="text-gray-600">
                Gestiona co-autores y colabora en tiempo real en tus publicaciones.
              </p>
            </div>

            <div className="card card-hover text-center">
              <TrendingUp className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Estadísticas</h3>
              <p className="text-gray-600">
                Analiza las métricas de tus publicaciones: vistas, descargas y citas.
              </p>
            </div>

            <div className="card card-hover text-center">
              <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Revisión por Pares</h3>
              <p className="text-gray-600">
                Sistema de comentarios y revisión para mejorar la calidad académica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a miles de investigadores que ya confían en ScholarHub 
            para gestionar sus publicaciones académicas.
          </p>
          <Link to="/auth/register" className="btn-primary">
            Crear Cuenta Gratuita
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;