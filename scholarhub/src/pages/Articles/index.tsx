import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  FileText, 
  Calendar, 
  User, 
  Tag,
  MoreVertical,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Heart,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useAppDispatch, useAppSelector, useAuth, useExport } from '../../hooks';
import { 
  fetchArticles, 
  deleteArticle, 
  toggleFavorite
} from '../../store/slices/articlesSlice';
import { setCurrentView } from '../../store/slices/uiSlice';
import { addNotification, openModal, closeModal } from '../../store/slices/uiSlice';
import clsx from 'clsx';

const Articles: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { exportToPDF, exportToWord, exportCitation } = useExport();
  
  const { myArticles, loading, pagination } = useAppSelector(state => state.articles);
  const { currentView, modal } = useAppSelector(state => state.ui);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'under_review'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views' | 'downloads'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Mock articles for demonstration
  const mockMyArticles = [
    {
      id: '1',
      title: 'Inteligencia Artificial en la Educación Superior',
      abstract: 'Este artículo examina el impacto de la IA en la educación superior y sus implicaciones futuras.',
      content: '<h2>Introducción</h2><p>La inteligencia artificial está transformando la educación...</p>',
      author: user!,
      keywords: ['inteligencia artificial', 'educación', 'tecnología educativa'],
      category: 'Inteligencia Artificial',
      publicationDate: '2024-01-15',
      lastModified: '2024-01-20',
      status: 'published' as const,
      views: 250,
      downloads: 45,
      journal: 'Revista de Tecnología Educativa',
      isFavorite: true
    },
    {
      id: '2',
      title: 'Machine Learning aplicado a la Detección de Fraudes',
      abstract: 'Análisis de algoritmos de aprendizaje automático para la detección temprana de fraudes financieros.',
      content: '<h2>Metodología</h2><p>Se implementaron diversos algoritmos...</p>',
      author: user!,
      keywords: ['machine learning', 'fraude', 'fintech', 'algoritmos'],
      category: 'Inteligencia Artificial',
      publicationDate: '2024-02-10',
      lastModified: '2024-02-12',
      status: 'under_review' as const,
      views: 89,
      downloads: 12,
      conference: 'Conferencia Internacional de IA',
      isFavorite: false
    },
    {
      id: '3',
      title: 'Blockchain en la Gestión de Identidad Digital',
      abstract: 'Propuesta de un sistema descentralizado para la gestión segura de identidades digitales usando blockchain.',
      content: '<h2>Arquitectura Propuesta</h2><p>El sistema propuesto se basa en...</p>',
      author: user!,
      keywords: ['blockchain', 'identidad digital', 'ciberseguridad', 'descentralización'],
      category: 'Blockchain',
      publicationDate: '2024-03-05',
      lastModified: '2024-03-05',
      status: 'draft' as const,
      views: 34,
      downloads: 3,
      isFavorite: false
    }
  ];

  useEffect(() => {
    // In a real app, this would fetch user's articles
    // dispatch(fetchArticles({ author: user?.id }));
  }, [dispatch, user]);

  // Filter and sort articles
  const filteredArticles = mockMyArticles
    .filter(article => {
      if (statusFilter !== 'all' && article.status !== statusFilter) return false;
      if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !article.abstract.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'views':
          aVal = a.views;
          bVal = b.views;
          break;
        case 'downloads':
          aVal = a.downloads;
          bVal = b.downloads;
          break;
        default: // date
          aVal = new Date(a.lastModified).getTime();
          bVal = new Date(b.lastModified).getTime();
          break;
      }
      
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const handleDeleteArticle = (articleId: string) => {
    dispatch(openModal({
      type: 'confirm',
      title: 'Eliminar Artículo',
      content: '¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.',
      onConfirm: () => {
        dispatch(deleteArticle(articleId));
        dispatch(addNotification({
          type: 'success',
          title: 'Artículo eliminado',
          message: 'El artículo se ha eliminado correctamente'
        }));
        dispatch(closeModal());
      },
      onCancel: () => dispatch(closeModal())
    }));
  };

  const handleToggleFavorite = (articleId: string) => {
    dispatch(toggleFavorite(articleId));
  };

  const handleShare = (article: any) => {
    const url = `${window.location.origin}/articles/${article.id}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.abstract,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      dispatch(addNotification({
        type: 'success',
        title: 'Enlace copiado',
        message: 'El enlace del artículo se ha copiado al portapapeles'
      }));
    }
  };

  const handleCopyDOI = (doi: string) => {
    navigator.clipboard.writeText(doi);
    dispatch(addNotification({
      type: 'success',
      title: 'DOI copiado',
      message: 'El DOI se ha copiado al portapapeles'
    }));
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'delete':
        dispatch(openModal({
          type: 'confirm',
          title: 'Eliminar Artículos',
          content: `¿Estás seguro de que quieres eliminar ${selectedArticles.length} artículo(s)? Esta acción no se puede deshacer.`,
          onConfirm: () => {
            selectedArticles.forEach(id => dispatch(deleteArticle(id)));
            setSelectedArticles([]);
            setShowBulkActions(false);
            dispatch(addNotification({
              type: 'success',
              title: 'Artículos eliminados',
              message: `${selectedArticles.length} artículo(s) eliminado(s) correctamente`
            }));
            dispatch(closeModal());
          },
          onCancel: () => dispatch(closeModal())
        }));
        break;
      case 'export':
        // Export selected articles
        const articlesToExport = mockMyArticles.filter(a => selectedArticles.includes(a.id));
        articlesToExport.forEach(article => exportToPDF(article));
        dispatch(addNotification({
          type: 'info',
          title: 'Exportando artículos',
          message: `Exportando ${articlesToExport.length} artículo(s) a PDF`
        }));
        break;
    }
  };

  const toggleArticleSelection = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(a => a.id));
    }
  };

  useEffect(() => {
    setShowBulkActions(selectedArticles.length > 0);
  }, [selectedArticles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Borrador';
      case 'under_review':
        return 'En Revisión';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Artículos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona todas tus publicaciones académicas
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard/articles/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Artículo
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en mis artículos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
              <option value="under_review">En Revisión</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date">Fecha</option>
              <option value="title">Título</option>
              <option value="views">Vistas</option>
              <option value="downloads">Descargas</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>

            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => dispatch(setCurrentView('list'))}
                className={clsx(
                  'p-2',
                  currentView === 'list' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-50'
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => dispatch(setCurrentView('grid'))}
                className={clsx(
                  'p-2',
                  currentView === 'grid' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-50'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-primary-800">
                {selectedArticles.length} artículo(s) seleccionado(s)
              </span>
              <button
                onClick={() => setSelectedArticles([])}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Deseleccionar todo
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('export')}
                className="btn-outline text-sm"
              >
                Exportar
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="btn-outline text-sm text-red-600 border-red-300 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles List/Grid */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando artículos...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No se encontraron artículos' : 'Aún no tienes artículos'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? 'Intenta ajustar tu búsqueda o filtros'
              : 'Comienza escribiendo tu primer artículo académico'
            }
          </p>
          {!searchQuery && (
            <Link to="/dashboard/articles/new" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Artículo
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedArticles.length === filteredArticles.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">
                  {filteredArticles.length} artículo(s) encontrado(s)
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className={clsx(
            currentView === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}>
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className={clsx(
                  'bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200',
                  selectedArticles.includes(article.id) && 'ring-2 ring-primary-500',
                  currentView === 'list' && 'flex gap-6'
                )}
              >
                {currentView === 'grid' ? (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={() => toggleArticleSelection(article.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className={clsx(
                          'inline-block px-2 py-1 text-xs font-medium rounded-full',
                          getStatusColor(article.status)
                        )}>
                          {getStatusText(article.status)}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === article.id ? null : article.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeDropdown === article.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <Link
                              to={`/articles/${article.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                              Ver artículo
                            </Link>
                            <Link
                              to={`/dashboard/articles/edit/${article.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </Link>
                            <button
                              onClick={() => handleToggleFavorite(article.id)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Heart className={clsx('w-4 h-4', article.isFavorite && 'fill-red-500 text-red-500')} />
                              {article.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            </button>
                            <button
                              onClick={() => handleShare(article)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Share2 className="w-4 h-4" />
                              Compartir
                            </button>
                            <div className="border-t border-gray-100">
                              <button
                                onClick={() => exportToPDF(article)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FileText className="w-4 h-4" />
                                Exportar PDF
                              </button>
                              <button
                                onClick={() => exportToWord(article)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Download className="w-4 h-4" />
                                Exportar Word
                              </button>
                            </div>
                            <div className="border-t border-gray-100">
                              <button
                                onClick={() => handleDeleteArticle(article.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {article.abstract}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">
                        {new Date(article.lastModified).toLocaleDateString('es-ES')}
                      </span>
                      <Tag className="w-4 h-4 mr-1" />
                      <span>{article.category}</span>
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

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/articles/edit/${article.id}`}
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/articles/${article.id}`}
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => toggleArticleSelection(article.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          <Link to={`/articles/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <span className={clsx(
                          'inline-block px-2 py-1 text-xs font-medium rounded-full ml-4',
                          getStatusColor(article.status)
                        )}>
                          {getStatusText(article.status)}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="mr-4">
                          Última modificación: {new Date(article.lastModified).toLocaleDateString('es-ES')}
                        </span>
                        <span className="mr-4">•</span>
                        <Tag className="w-4 h-4 mr-1" />
                        <span>{article.category}</span>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.abstract}
                      </p>

                      <div className="flex items-center justify-between">
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

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/articles/edit/${article.id}`}
                            className="btn-outline text-sm"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Link>
                          <Link
                            to={`/articles/${article.id}`}
                            className="btn-primary text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Component */}
      {modal.isOpen && modal.type === 'confirm' && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {modal.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {modal.content}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={modal.onCancel}
                className="btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={modal.onConfirm}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;