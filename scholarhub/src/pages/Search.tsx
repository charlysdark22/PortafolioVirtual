import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar,
  User,
  Tag,
  Grid,
  List,
  Download,
  Heart,
  Eye,
  FileText,
  X,
  ChevronDown
} from 'lucide-react';
import { useAppDispatch, useAppSelector, useExport } from '../hooks';
import { searchArticles, setFilters, toggleFavorite } from '../store/slices/articlesSlice';
import { setCurrentView, addNotification } from '../store/slices/uiSlice';
import clsx from 'clsx';

const Search: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { searchResults, searchLoading, filters } = useAppSelector(state => state.articles);
  const { currentView } = useAppSelector(state => state.ui);
  const { exportToPDF, exportToWord, exportCitation } = useExport();

  // Search state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'relevance' | 'views' | 'downloads'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filter state
  const [authorFilter, setAuthorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'under_review'>('all');

  const categories = [
    'Inteligencia Artificial',
    'Ingeniería de Software',
    'Ciencias de Datos',
    'Ciberseguridad',
    'Redes y Comunicaciones',
    'Bases de Datos',
    'Interfaces Humano-Computador',
    'Computación Distribuida',
    'Algoritmos y Estructuras',
    'Sistemas Operativos'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== query) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery?: string) => {
    const searchFilters = {
      query: searchQuery || query,
      author: authorFilter || undefined,
      category: categoryFilter || undefined,
      keywords: keywordFilter ? [keywordFilter] : undefined,
      startYear: startYear ? parseInt(startYear) : undefined,
      endYear: endYear ? parseInt(endYear) : undefined,
      status: statusFilter !== 'all' ? statusFilter as any : undefined,
    };

    dispatch(setFilters(searchFilters));
    dispatch(searchArticles(searchFilters));

    // Update URL
    const params = new URLSearchParams();
    if (searchQuery || query) params.set('q', searchQuery || query);
    if (authorFilter) params.set('author', authorFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    if (keywordFilter) params.set('keywords', keywordFilter);
    if (startYear) params.set('startYear', startYear);
    if (endYear) params.set('endYear', endYear);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setAuthorFilter('');
    setCategoryFilter('');
    setKeywordFilter('');
    setStartYear('');
    setEndYear('');
    setStatusFilter('all');
    setQuery('');
    setSearchParams({});
    dispatch(setFilters({}));
  };

  const handleSort = (articles: any[]) => {
    return [...articles].sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.publicationDate).getTime();
          bVal = new Date(b.publicationDate).getTime();
          break;
        case 'views':
          aVal = a.views;
          bVal = b.views;
          break;
        case 'downloads':
          aVal = a.downloads;
          bVal = b.downloads;
          break;
        default: // relevance
          aVal = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
          bVal = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
          break;
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  };

  const sortedResults = handleSort(searchResults);

  const handleToggleFavorite = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(articleId));
  };

  const handleViewArticle = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  const handleExportArticle = (article: any, format: 'pdf' | 'word', e: React.MouseEvent) => {
    e.stopPropagation();
    if (format === 'pdf') {
      exportToPDF(article);
    } else {
      exportToWord(article);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Búsqueda de Artículos Académicos
        </h1>
        
        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar por título, resumen, autor o palabras clave..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={searchLoading}
            className="btn-primary px-6"
          >
            {searchLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Buscar'
            )}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              'btn-outline flex items-center gap-2',
              showFilters && 'bg-primary-50 border-primary-300 text-primary-700'
            )}
          >
            <Filter className="w-4 h-4" />
            Filtros
            <ChevronDown className={clsx('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Autor
              </label>
              <input
                type="text"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                placeholder="Nombre del autor"
                className="input-field"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Categoría
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Keywords Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Palabras Clave
              </label>
              <input
                type="text"
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                placeholder="Palabra clave"
                className="input-field"
              />
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Año Inicio
              </label>
              <select
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="input-field"
              >
                <option value="">Cualquier año</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Año Fin
              </label>
              <select
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="input-field"
              >
                <option value="">Cualquier año</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="input-field"
              >
                <option value="all">Todos los estados</option>
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
                <option value="under_review">En Revisión</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <button onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4 inline mr-1" />
              Limpiar Filtros
            </button>
            <button onClick={() => handleSearch()} className="btn-primary">
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {sortedResults.length > 0 ? (
              `${sortedResults.length} resultado${sortedResults.length !== 1 ? 's' : ''} encontrado${sortedResults.length !== 1 ? 's' : ''}`
            ) : searchLoading ? (
              'Buscando...'
            ) : (
              'Sin resultados'
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="relevance">Relevancia</option>
                <option value="date">Fecha</option>
                <option value="views">Vistas</option>
                <option value="downloads">Descargas</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => dispatch(setCurrentView('list'))}
                className={clsx(
                  'p-2',
                  currentView === 'list' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => dispatch(setCurrentView('grid'))}
                className={clsx(
                  'p-2',
                  currentView === 'grid' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {searchLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Buscando artículos...</p>
        </div>
      ) : sortedResults.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron artículos</h3>
          <p className="text-gray-600 mb-4">
            Intenta ajustar tus criterios de búsqueda o filtros
          </p>
          <button onClick={clearFilters} className="btn-outline">
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className={clsx(
          currentView === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        )}>
          {sortedResults.map((article) => (
            <div
              key={article.id}
              onClick={() => handleViewArticle(article.id)}
              className={clsx(
                'bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-200',
                currentView === 'list' && 'flex gap-6'
              )}
            >
              {currentView === 'grid' ? (
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={clsx(
                      'inline-block px-2 py-1 text-xs font-medium rounded-full',
                      article.status === 'published' ? 'bg-green-100 text-green-800' :
                      article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    )}>
                      {article.status === 'published' ? 'Publicado' :
                       article.status === 'draft' ? 'Borrador' : 'En Revisión'}
                    </span>
                    <button
                      onClick={(e) => handleToggleFavorite(article.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className={clsx('w-5 h-5', article.isFavorite && 'fill-red-500 text-red-500')} />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {article.abstract}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <User className="w-4 h-4 mr-1" />
                    <span className="mr-4">{article.author.fullName}</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(article.publicationDate).getFullYear()}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                    {article.keywords.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        +{article.keywords.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views}
                      </span>
                      <span className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {article.downloads}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleExportArticle(article, 'pdf', e)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Exportar a PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleExportArticle(article, 'word', e)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Exportar a Word"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                        {article.title}
                      </h3>
                      <span className={clsx(
                        'inline-block px-2 py-1 text-xs font-medium rounded-full ml-4',
                        article.status === 'published' ? 'bg-green-100 text-green-800' :
                        article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      )}>
                        {article.status === 'published' ? 'Publicado' :
                         article.status === 'draft' ? 'Borrador' : 'En Revisión'}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-4">{article.author.fullName}</span>
                      <span className="mr-4">•</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">{new Date(article.publicationDate).toLocaleDateString('es-ES')}</span>
                      <span className="mr-4">•</span>
                      <Tag className="w-4 h-4 mr-1" />
                      <span>{article.category}</span>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {article.abstract}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {article.keywords.slice(0, 5).map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                      {article.keywords.length > 5 && (
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          +{article.keywords.length - 5}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 space-x-6">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views} vistas
                      </span>
                      <span className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {article.downloads} descargas
                      </span>
                      {article.journal && (
                        <span>Revista: {article.journal}</span>
                      )}
                      {article.conference && (
                        <span>Conferencia: {article.conference}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={(e) => handleToggleFavorite(article.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className={clsx('w-5 h-5', article.isFavorite && 'fill-red-500 text-red-500')} />
                    </button>
                    <button
                      onClick={(e) => handleExportArticle(article, 'pdf', e)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Exportar a PDF"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleExportArticle(article, 'word', e)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Exportar a Word"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;