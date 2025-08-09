import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Activity,
  Eye,
  Download,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Mail,
  Settings
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts';
import { useAppDispatch, useAppSelector, useAuth } from '../../hooks';
import { addNotification, openModal, closeModal } from '../../store/slices/uiSlice';
import clsx from 'clsx';

interface AdminStats {
  totalUsers: number;
  totalArticles: number;
  pendingReviews: number;
  monthlyGrowth: number;
  totalViews: number;
  totalDownloads: number;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'autor' | 'admin';
  institution?: string;
  registrationDate: string;
  lastLogin?: string;
  articlesCount: number;
  status: 'active' | 'suspended' | 'pending';
}

interface ArticleReview {
  id: string;
  title: string;
  author: string;
  submissionDate: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerNotes?: string;
}

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { modal } = useAppSelector(state => state.ui);

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'articles' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data for demonstration
  const adminStats: AdminStats = {
    totalUsers: 1247,
    totalArticles: 3852,
    pendingReviews: 23,
    monthlyGrowth: 12.5,
    totalViews: 45632,
    totalDownloads: 8934
  };

  const analyticsData = [
    { month: 'Ene', usuarios: 120, articulos: 45, vistas: 3200 },
    { month: 'Feb', usuarios: 145, articulos: 52, vistas: 3800 },
    { month: 'Mar', usuarios: 189, articulos: 61, vistas: 4200 },
    { month: 'Abr', usuarios: 234, articulos: 78, vistas: 4900 },
    { month: 'May', usuarios: 276, articulos: 89, vistas: 5400 },
    { month: 'Jun', usuarios: 325, articulos: 102, vistas: 6100 }
  ];

  const categoryData = [
    { name: 'IA', value: 35, color: '#0ea5e9' },
    { name: 'Software', value: 25, color: '#8b5cf6' },
    { name: 'Datos', value: 20, color: '#10b981' },
    { name: 'Seguridad', value: 12, color: '#f59e0b' },
    { name: 'Otros', value: 8, color: '#ef4444' }
  ];

  const mockUsers: UserData[] = [
    {
      id: '1',
      username: 'dr_garcia',
      email: 'garcia@universidad.edu',
      fullName: 'Dr. María García',
      role: 'autor',
      institution: 'Universidad Nacional',
      registrationDate: '2024-01-15',
      lastLogin: '2024-03-10',
      articlesCount: 12,
      status: 'active'
    },
    {
      id: '2',
      username: 'prof_martinez',
      email: 'martinez@tech.edu',
      fullName: 'Prof. Carlos Martínez',
      role: 'autor',
      institution: 'Instituto Tecnológico',
      registrationDate: '2024-02-20',
      lastLogin: '2024-03-09',
      articlesCount: 8,
      status: 'active'
    },
    {
      id: '3',
      username: 'ana_rodriguez',
      email: 'ana.r@research.org',
      fullName: 'Ana Rodríguez',
      role: 'autor',
      institution: 'Centro de Investigación',
      registrationDate: '2024-03-01',
      lastLogin: '2024-03-08',
      articlesCount: 3,
      status: 'pending'
    },
    {
      id: '4',
      username: 'spam_user',
      email: 'suspicious@fake.com',
      fullName: 'Usuario Sospechoso',
      role: 'autor',
      registrationDate: '2024-03-05',
      articlesCount: 0,
      status: 'suspended'
    }
  ];

  const mockPendingReviews: ArticleReview[] = [
    {
      id: '1',
      title: 'Análisis de Algoritmos Cuánticos para Optimización',
      author: 'Dr. María García',
      submissionDate: '2024-03-08',
      category: 'Inteligencia Artificial',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Seguridad en Aplicaciones Blockchain',
      author: 'Prof. Carlos Martínez',
      submissionDate: '2024-03-07',
      category: 'Ciberseguridad',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Machine Learning en Diagnóstico Médico',
      author: 'Ana Rodríguez',
      submissionDate: '2024-03-06',
      category: 'Inteligencia Artificial',
      status: 'pending'
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    if (searchQuery && !user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete' | 'makeAdmin') => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;

    const actions = {
      suspend: {
        title: 'Suspender Usuario',
        content: `¿Estás seguro de que quieres suspender a ${user.fullName}?`,
        action: () => {
          dispatch(addNotification({
            type: 'success',
            title: 'Usuario suspendido',
            message: `${user.fullName} ha sido suspendido`
          }));
        }
      },
      activate: {
        title: 'Activar Usuario',
        content: `¿Estás seguro de que quieres activar a ${user.fullName}?`,
        action: () => {
          dispatch(addNotification({
            type: 'success',
            title: 'Usuario activado',
            message: `${user.fullName} ha sido activado`
          }));
        }
      },
      delete: {
        title: 'Eliminar Usuario',
        content: `¿Estás seguro de que quieres eliminar permanentemente a ${user.fullName}? Esta acción no se puede deshacer.`,
        action: () => {
          dispatch(addNotification({
            type: 'success',
            title: 'Usuario eliminado',
            message: `${user.fullName} ha sido eliminado del sistema`
          }));
        }
      },
      makeAdmin: {
        title: 'Promover a Administrador',
        content: `¿Estás seguro de que quieres hacer administrador a ${user.fullName}?`,
        action: () => {
          dispatch(addNotification({
            type: 'success',
            title: 'Usuario promovido',
            message: `${user.fullName} ahora es administrador`
          }));
        }
      }
    };

    const selectedAction = actions[action];
    
    dispatch(openModal({
      type: 'confirm',
      title: selectedAction.title,
      content: selectedAction.content,
      onConfirm: () => {
        selectedAction.action();
        dispatch(closeModal());
      },
      onCancel: () => dispatch(closeModal())
    }));
  };

  const handleArticleReview = (articleId: string, action: 'approve' | 'reject') => {
    const article = mockPendingReviews.find(a => a.id === articleId);
    if (!article) return;

    dispatch(openModal({
      type: 'confirm',
      title: action === 'approve' ? 'Aprobar Artículo' : 'Rechazar Artículo',
      content: `¿Estás seguro de que quieres ${action === 'approve' ? 'aprobar' : 'rechazar'} "${article.title}"?`,
      onConfirm: () => {
        dispatch(addNotification({
          type: 'success',
          title: action === 'approve' ? 'Artículo aprobado' : 'Artículo rechazado',
          message: `"${article.title}" ha sido ${action === 'approve' ? 'aprobado' : 'rechazado'}`
        }));
        dispatch(closeModal());
      },
      onCancel: () => dispatch(closeModal())
    }));
  };

  const handleBulkUserAction = (action: 'suspend' | 'activate' | 'delete') => {
    if (selectedUsers.length === 0) return;

    dispatch(openModal({
      type: 'confirm',
      title: `${action === 'suspend' ? 'Suspender' : action === 'activate' ? 'Activar' : 'Eliminar'} Usuarios`,
      content: `¿Estás seguro de que quieres ${action === 'suspend' ? 'suspender' : action === 'activate' ? 'activar' : 'eliminar'} ${selectedUsers.length} usuario(s)?`,
      onConfirm: () => {
        dispatch(addNotification({
          type: 'success',
          title: 'Acción completada',
          message: `${selectedUsers.length} usuario(s) ${action === 'suspend' ? 'suspendido(s)' : action === 'activate' ? 'activado(s)' : 'eliminado(s)'}`
        }));
        setSelectedUsers([]);
        dispatch(closeModal());
      },
      onCancel: () => dispatch(closeModal())
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'suspended':
        return 'Suspendido';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">
              Gestiona usuarios, contenido y estadísticas de la plataforma
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-outline flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuración
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Resumen', icon: BarChart3 },
              { id: 'users', label: 'Usuarios', icon: Users },
              { id: 'articles', label: 'Artículos', icon: FileText },
              { id: 'analytics', label: 'Analíticas', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={clsx(
                    'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Usuarios</p>
                      <p className="text-3xl font-bold">{adminStats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-blue-200 mr-1" />
                    <span className="text-blue-100 text-sm">+{adminStats.monthlyGrowth}% este mes</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Artículos</p>
                      <p className="text-3xl font-bold">{adminStats.totalArticles.toLocaleString()}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-200" />
                  </div>
                  <div className="mt-4 flex items-center">
                    <Activity className="w-4 h-4 text-green-200 mr-1" />
                    <span className="text-green-100 text-sm">85% publicados</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Pendientes Revisión</p>
                      <p className="text-3xl font-bold">{adminStats.pendingReviews}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-200" />
                  </div>
                  <div className="mt-4 flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-200 mr-1" />
                    <span className="text-yellow-100 text-sm">Requiere atención</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Vistas</p>
                      <p className="text-3xl font-bold">{adminStats.totalViews.toLocaleString()}</p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-200" />
                  </div>
                  <div className="mt-4 flex items-center">
                    <Download className="w-4 h-4 text-purple-200 mr-1" />
                    <span className="text-purple-100 text-sm">{adminStats.totalDownloads.toLocaleString()} descargas</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Nuevo usuario registrado: Ana Rodríguez</span>
                      <span className="text-xs text-gray-400 ml-auto">hace 2h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Artículo publicado: "IA en Medicina"</span>
                      <span className="text-xs text-gray-400 ml-auto">hace 4h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Artículo pendiente de revisión</span>
                      <span className="text-xs text-gray-400 ml-auto">hace 6h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Usuario suspendido por spam</span>
                      <span className="text-xs text-gray-400 ml-auto">hace 1d</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Artículos Pendientes de Revisión</h3>
                  <div className="space-y-3">
                    {mockPendingReviews.slice(0, 4).map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {article.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {article.author} • {new Date(article.submissionDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleArticleReview(article.id, 'approve')}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleArticleReview(article.id, 'reject')}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar usuarios..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="suspended">Suspendidos</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedUsers.length} usuario(s) seleccionado(s)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBulkUserAction('activate')}
                        className="btn-outline text-sm"
                      >
                        Activar
                      </button>
                      <button
                        onClick={() => handleBulkUserAction('suspend')}
                        className="btn-outline text-sm"
                      >
                        Suspender
                      </button>
                      <button
                        onClick={() => handleBulkUserAction('delete')}
                        className="btn-outline text-sm text-red-600 border-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length}
                            onChange={() => {
                              if (selectedUsers.length === filteredUsers.length) {
                                setSelectedUsers([]);
                              } else {
                                setSelectedUsers(filteredUsers.map(u => u.id));
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Institución
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Artículos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último Acceso
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => {
                                if (selectedUsers.includes(user.id)) {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                } else {
                                  setSelectedUsers([...selectedUsers, user.id]);
                                }
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {user.fullName.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                <div className="text-sm text-gray-500">@{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.institution || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.articlesCount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={clsx(
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              getStatusColor(user.status)
                            )}>
                              {getStatusText(user.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleUserAction(user.id, 'suspend')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Suspender"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Activar"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                              )}
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleUserAction(user.id, 'makeAdmin')}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Hacer Administrador"
                                >
                                  <Shield className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => window.location.href = `mailto:${user.email}`}
                                className="text-gray-600 hover:text-gray-900"
                                title="Enviar Email"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Artículos</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Artículos Pendientes de Revisión</h4>
                  <div className="space-y-4">
                    {mockPendingReviews.map((article) => (
                      <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-1">{article.title}</h5>
                            <p className="text-sm text-gray-600 mb-2">
                              Por: {article.author} • {article.category}
                            </p>
                            <p className="text-xs text-gray-500">
                              Enviado: {new Date(article.submissionDate).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleArticleReview(article.id, 'approve')}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleArticleReview(article.id, 'reject')}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Rechazar"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Estadísticas por Categoría</h4>
                  <div className="space-y-4">
                    {categoryData.map((category) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${category.value}%`,
                                backgroundColor: category.color 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{category.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Analíticas de la Plataforma</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Crecimiento Mensual</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="usuarios" stroke="#0ea5e9" strokeWidth={2} />
                      <Line type="monotone" dataKey="articulos" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Distribución por Categorías</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        dataKey="value"
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Vistas de Artículos</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="vistas" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
                className="btn-primary"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;