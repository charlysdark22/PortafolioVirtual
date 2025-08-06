import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Heart,
  Share2,
  Download,
  FileText,
  User,
  Calendar,
  Tag,
  Eye,
  BookOpen,
  Award,
  Globe,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Copy,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  Edit,
  MoreVertical,
  Quote,
  Bookmark
} from 'lucide-react';
import { useAppDispatch, useAppSelector, useAuth, useExport } from '../../hooks';
import { 
  fetchArticleById, 
  incrementViews, 
  toggleFavorite 
} from '../../store/slices/articlesSlice';
import { addNotification } from '../../store/slices/uiSlice';
import clsx from 'clsx';

interface Comment {
  id: string;
  author: {
    id: string;
    fullName: string;
    avatar?: string;
    institution?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
  isEdited?: boolean;
  userReaction?: 'like' | 'dislike' | null;
}

interface RelatedArticle {
  id: string;
  title: string;
  author: string;
  category: string;
  views: number;
}

const ArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const { exportToPDF, exportToWord, exportCitation } = useExport();
  
  const { currentArticle, loading } = useAppSelector(state => state.articles);
  
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentsSort, setCommentsSort] = useState<'newest' | 'oldest' | 'popular'>('newest');

  // Mock article data (in real app, this would come from the store)
  const mockArticle = {
    id: id || '1',
    title: 'Inteligencia Artificial en la Educación Superior: Transformando el Aprendizaje del Siglo XXI',
    content: `
      <h2>Resumen</h2>
      <p>La inteligencia artificial (IA) está revolucionando múltiples sectores, y la educación superior no es la excepción. Este artículo examina el impacto transformador de la IA en las instituciones académicas, analizando tanto las oportunidades como los desafíos que presenta esta tecnología emergente.</p>
      
      <h2>Introducción</h2>
      <p>En la era digital actual, la educación superior se encuentra en un punto de inflexión crucial. La adopción de tecnologías de inteligencia artificial está redefiniendo la forma en que estudiantes aprenden, profesores enseñan y las instituciones operan. Desde sistemas de tutoría personalizada hasta herramientas de evaluación automatizada, la IA está creando nuevas posibilidades para mejorar la experiencia educativa.</p>
      
      <h2>Aplicaciones de la IA en Educación Superior</h2>
      <h3>1. Personalización del Aprendizaje</h3>
      <p>Los sistemas de IA pueden analizar el comportamiento de aprendizaje de cada estudiante para crear experiencias educativas personalizadas. Esto incluye:</p>
      <ul>
        <li>Rutas de aprendizaje adaptativas</li>
        <li>Recomendaciones de contenido personalizado</li>
        <li>Identificación temprana de estudiantes en riesgo</li>
      </ul>
      
      <h3>2. Automatización de Procesos Administrativos</h3>
      <p>La IA está streamlineando procesos administrativos complejos, incluyendo admisiones, programación de cursos y gestión de recursos.</p>
      
      <h2>Desafíos y Consideraciones Éticas</h2>
      <p>A pesar de sus beneficios, la implementación de IA en educación superior presenta varios desafíos:</p>
      <ul>
        <li>Privacidad y protección de datos estudiantiles</li>
        <li>Sesgo algorítmico y equidad</li>
        <li>Resistencia al cambio por parte del personal académico</li>
        <li>Costos de implementación y mantenimiento</li>
      </ul>
      
      <h2>Casos de Estudio</h2>
      <p>Varias universidades han implementado exitosamente soluciones de IA. Por ejemplo, la Universidad de Stanford ha desarrollado un sistema de tutoría inteligente que ha mejorado significativamente las tasas de retención estudiantil.</p>
      
      <h2>Conclusiones</h2>
      <p>La inteligencia artificial representa una oportunidad sin precedentes para transformar la educación superior. Sin embargo, su implementación exitosa requiere una planificación cuidadosa, consideración de aspectos éticos y un enfoque centrado en el estudiante.</p>
      
      <h2>Referencias</h2>
      <p>Este artículo se basa en un análisis exhaustivo de la literatura actual y entrevistas con expertos en educación y tecnología.</p>
    `,
    abstract: 'Este artículo examina el impacto transformador de la inteligencia artificial en la educación superior, analizando aplicaciones actuales, beneficios potenciales y desafíos éticos. Se presentan casos de estudio y recomendaciones para la implementación exitosa de tecnologías de IA en instituciones académicas.',
    author: {
      id: '1',
      username: 'dr_garcia',
      email: 'garcia@universidad.edu',
      role: 'autor' as const,
      fullName: 'Dr. María García',
      institution: 'Universidad Nacional de Tecnología',
      registrationDate: '2023-01-15',
      bio: 'Doctora en Ciencias de la Computación especializada en Inteligencia Artificial y Educación Digital. Investigadora principal en el Centro de Innovación Educativa.'
    },
    coAuthors: [
      {
        id: '2',
        username: 'prof_martinez',
        email: 'martinez@tech.edu',
        role: 'autor' as const,
        fullName: 'Prof. Carlos Martínez',
        institution: 'Instituto Tecnológico Superior',
        registrationDate: '2023-02-10'
      }
    ],
    keywords: ['inteligencia artificial', 'educación superior', 'tecnología educativa', 'aprendizaje personalizado', 'transformación digital'],
    category: 'Inteligencia Artificial',
    publicationDate: '2024-01-15',
    lastModified: '2024-01-20',
    doi: '10.1234/scholarhub.2024.001',
    journal: 'Revista Internacional de Tecnología Educativa',
    status: 'published' as const,
    views: 1247,
    downloads: 89,
    isFavorite: false
  };

  const mockComments: Comment[] = [
    {
      id: '1',
      author: {
        id: '3',
        fullName: 'Dr. Ana López',
        institution: 'Universidad de Barcelona'
      },
      content: 'Excelente análisis sobre el impacto de la IA en educación superior. Me parece particularmente interesante la sección sobre personalización del aprendizaje. ¿Tienen datos sobre la efectividad de estos sistemas en diferentes disciplinas?',
      timestamp: '2024-03-10T14:30:00Z',
      likes: 12,
      dislikes: 1,
      userReaction: null,
      replies: [
        {
          id: '1-1',
          author: {
            id: '1',
            fullName: 'Dr. María García',
            institution: 'Universidad Nacional de Tecnología'
          },
          content: 'Gracias por su comentario, Dr. López. En nuestras investigaciones hemos encontrado que los sistemas de IA son especialmente efectivos en matemáticas y ciencias. Estamos preparando un artículo específico sobre este tema.',
          timestamp: '2024-03-10T15:45:00Z',
          likes: 8,
          dislikes: 0,
          userReaction: null
        }
      ]
    },
    {
      id: '2',
      author: {
        id: '4',
        fullName: 'Prof. Roberto Silva',
        institution: 'Instituto de Investigación Educativa'
      },
      content: 'Me gustaría conocer más sobre los aspectos éticos mencionados. ¿Consideran que existe suficiente regulación actual para proteger la privacidad de los estudiantes?',
      timestamp: '2024-03-09T10:15:00Z',
      likes: 7,
      dislikes: 0,
      userReaction: null
    },
    {
      id: '3',
      author: {
        id: '5',
        fullName: 'Estudiante de Doctorado Juan Pérez',
        institution: 'Universidad Autónoma'
      },
      content: 'Como estudiante que ha experimentado algunas de estas tecnologías, puedo confirmar que la personalización del aprendizaje realmente hace una diferencia. Sin embargo, creo que es importante mantener el elemento humano en la educación.',
      timestamp: '2024-03-08T16:20:00Z',
      likes: 15,
      dislikes: 2,
      userReaction: null
    }
  ];

  const relatedArticles: RelatedArticle[] = [
    {
      id: '2',
      title: 'Machine Learning en el Diagnóstico Médico',
      author: 'Dr. Elena Ruiz',
      category: 'Inteligencia Artificial',
      views: 892
    },
    {
      id: '3',
      title: 'Ética en la Inteligencia Artificial',
      author: 'Prof. Miguel Torres',
      category: 'Inteligencia Artificial',
      views: 745
    },
    {
      id: '4',
      title: 'Transformación Digital en Universidades',
      author: 'Dra. Carmen Vega',
      category: 'Tecnología Educativa',
      views: 623
    }
  ];

  useEffect(() => {
    if (id) {
      // dispatch(fetchArticleById(id));
      dispatch(incrementViews(id));
    }
  }, [dispatch, id]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        type: 'warning',
        title: 'Inicio de sesión requerido',
        message: 'Debes iniciar sesión para agregar artículos a favoritos'
      }));
      return;
    }
    dispatch(toggleFavorite(mockArticle.id));
    dispatch(addNotification({
      type: 'success',
      title: mockArticle.isFavorite ? 'Removido de favoritos' : 'Agregado a favoritos',
      message: `El artículo ha sido ${mockArticle.isFavorite ? 'removido de' : 'agregado a'} tus favoritos`
    }));
  };

  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const title = mockArticle.title;
    const text = mockArticle.abstract;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({ title, text, url });
        } else {
          navigator.clipboard.writeText(url);
          dispatch(addNotification({
            type: 'success',
            title: 'Enlace copiado',
            message: 'El enlace del artículo se ha copiado al portapapeles'
          }));
        }
    }
    setShowShareMenu(false);
  };

  const handleAddComment = () => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        type: 'warning',
        title: 'Inicio de sesión requerido',
        message: 'Debes iniciar sesión para comentar'
      }));
      return;
    }

    if (!newComment.trim()) return;

    // In a real app, this would dispatch an action to add the comment
    dispatch(addNotification({
      type: 'success',
      title: 'Comentario agregado',
      message: 'Tu comentario ha sido publicado correctamente'
    }));
    setNewComment('');
  };

  const handleReply = (commentId: string) => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        type: 'warning',
        title: 'Inicio de sesión requerido',
        message: 'Debes iniciar sesión para responder'
      }));
      return;
    }

    if (!replyContent.trim()) return;

    // In a real app, this would dispatch an action to add the reply
    dispatch(addNotification({
      type: 'success',
      title: 'Respuesta agregada',
      message: 'Tu respuesta ha sido publicada correctamente'
    }));
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleCommentReaction = (commentId: string, reaction: 'like' | 'dislike') => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        type: 'warning',
        title: 'Inicio de sesión requerido',
        message: 'Debes iniciar sesión para reaccionar'
      }));
      return;
    }

    // In a real app, this would dispatch an action to update the reaction
    dispatch(addNotification({
      type: 'info',
      title: 'Reacción registrada',
      message: `Has ${reaction === 'like' ? 'dado like' : 'dado dislike'} al comentario`
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `hace ${diffInMinutes} minutos`;
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} horas`;
    return `hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  const sortedComments = [...mockComments].sort((a, b) => {
    switch (commentsSort) {
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'popular':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      default: // newest
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        
        <div className="flex items-center gap-3">
          {user?.id === mockArticle.author.id && (
            <Link
              to={`/dashboard/articles/edit/${mockArticle.id}`}
              className="btn-outline flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Link>
          )}
          
          <button
            onClick={handleToggleFavorite}
            className={clsx(
              'btn-outline flex items-center gap-2',
              mockArticle.isFavorite && 'text-red-600 border-red-300 bg-red-50'
            )}
          >
            <Heart className={clsx('w-4 h-4', mockArticle.isFavorite && 'fill-red-600')} />
            {mockArticle.isFavorite ? 'En Favoritos' : 'Favorito'}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="btn-outline flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
            
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Twitter className="w-4 h-4 text-blue-400" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Linkedin className="w-4 h-4 text-blue-700" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Mail className="w-4 h-4 text-gray-600" />
                  Email
                </button>
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => handleShare()}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                    Copiar enlace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {mockArticle.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{mockArticle.author.fullName}</span>
                    {mockArticle.coAuthors && mockArticle.coAuthors.length > 0 && (
                      <span>, {mockArticle.coAuthors.map(author => author.fullName).join(', ')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(mockArticle.publicationDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>{mockArticle.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{mockArticle.views.toLocaleString()} vistas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{mockArticle.downloads} descargas</span>
                  </div>
                </div>

                {/* Publication Details */}
                <div className="space-y-2">
                  {mockArticle.journal && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>Revista: {mockArticle.journal}</span>
                    </div>
                  )}
                  
                  {mockArticle.doi && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>DOI: {mockArticle.doi}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(mockArticle.doi!);
                          dispatch(addNotification({
                            type: 'success',
                            title: 'DOI copiado',
                            message: 'El DOI se ha copiado al portapapeles'
                          }));
                        }}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Abstract */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Resumen</h2>
                <p className="text-gray-700 leading-relaxed">{mockArticle.abstract}</p>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Palabras Clave</h3>
                <div className="flex flex-wrap gap-2">
                  {mockArticle.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: mockArticle.content }}
            />
          </div>

          {/* Export Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Artículo</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => exportToPDF(mockArticle)}
                className="btn-outline flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Exportar a PDF
              </button>
              <button
                onClick={() => exportToWord(mockArticle)}
                className="btn-outline flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar a Word
              </button>
              <button
                onClick={() => exportCitation(mockArticle, 'apa')}
                className="btn-outline flex items-center gap-2"
              >
                <Quote className="w-4 h-4" />
                Cita APA
              </button>
              <button
                onClick={() => exportCitation(mockArticle, 'bibtex')}
                className="btn-outline flex items-center gap-2"
              >
                <Quote className="w-4 h-4" />
                Cita BibTeX
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comentarios ({mockComments.length})
              </h3>
              <div className="flex items-center gap-4">
                <select
                  value={commentsSort}
                  onChange={(e) => setCommentsSort(e.target.value as any)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="popular">Más populares</option>
                </select>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  {showComments ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {/* Add Comment */}
            {isAuthenticated ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.fullName?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe tu comentario..."
                      className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Comentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-3">Inicia sesión para comentar</p>
                <Link to="/auth/login" className="btn-primary">
                  Iniciar Sesión
                </Link>
              </div>
            )}

            {/* Comments List */}
            {showComments && (
              <div className="space-y-6">
                {sortedComments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {comment.author.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.author.fullName}</span>
                          {comment.author.institution && (
                            <span className="text-sm text-gray-500">• {comment.author.institution}</span>
                          )}
                          <span className="text-sm text-gray-500">• {formatRelativeTime(comment.timestamp)}</span>
                          {comment.isEdited && (
                            <span className="text-xs text-gray-400">(editado)</span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{comment.content}</p>
                        
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleCommentReaction(comment.id, 'like')}
                            className={clsx(
                              'flex items-center gap-1 text-sm transition-colors',
                              comment.userReaction === 'like' 
                                ? 'text-green-600' 
                                : 'text-gray-500 hover:text-green-600'
                            )}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {comment.likes}
                          </button>
                          <button
                            onClick={() => handleCommentReaction(comment.id, 'dislike')}
                            className={clsx(
                              'flex items-center gap-1 text-sm transition-colors',
                              comment.userReaction === 'dislike' 
                                ? 'text-red-600' 
                                : 'text-gray-500 hover:text-red-600'
                            )}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            {comment.dislikes}
                          </button>
                          <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Responder
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700">
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && isAuthenticated && (
                          <div className="mt-4 ml-4 p-3 bg-gray-50 rounded-lg">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Escribe tu respuesta..."
                              className="w-full border border-gray-300 rounded p-2 resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              rows={2}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="btn-outline text-sm"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleReply(comment.id)}
                                disabled={!replyContent.trim()}
                                className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Responder
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-gray-600 text-xs font-medium">
                                    {reply.author.fullName.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900 text-sm">{reply.author.fullName}</span>
                                    <span className="text-xs text-gray-500">• {formatRelativeTime(reply.timestamp)}</span>
                                  </div>
                                  <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => handleCommentReaction(reply.id, 'like')}
                                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600"
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                      {reply.likes}
                                    </button>
                                    <button
                                      onClick={() => handleCommentReaction(reply.id, 'dislike')}
                                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
                                    >
                                      <ThumbsDown className="w-3 h-3" />
                                      {reply.dislikes}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Autor</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {mockArticle.author.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{mockArticle.author.fullName}</h4>
                  <p className="text-sm text-gray-600">{mockArticle.author.institution}</p>
                </div>
              </div>
              {mockArticle.author.bio && (
                <p className="text-sm text-gray-700">{mockArticle.author.bio}</p>
              )}
            </div>

            {/* Co-authors */}
            {mockArticle.coAuthors && mockArticle.coAuthors.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Co-autores</h4>
                <div className="space-y-2">
                  {mockArticle.coAuthors.map((coAuthor) => (
                    <div key={coAuthor.id} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-medium">
                          {coAuthor.fullName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{coAuthor.fullName}</p>
                        <p className="text-xs text-gray-600">{coAuthor.institution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Article Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vistas</span>
                <span className="font-medium">{mockArticle.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Descargas</span>
                <span className="font-medium">{mockArticle.downloads}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Comentarios</span>
                <span className="font-medium">{mockComments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Publicado</span>
                <span className="font-medium">{formatDate(mockArticle.publicationDate)}</span>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Artículos Relacionados</h3>
            <div className="space-y-4">
              {relatedArticles.map((article) => (
                <div key={article.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <Link 
                    to={`/articles/${article.id}`}
                    className="block hover:bg-gray-50 -m-2 p-2 rounded transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1">por {article.author}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.category}</span>
                      <span>{article.views} vistas</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Click overlay to close share menu */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default ArticleView;