import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, 
  Mail, 
  Building, 
  Camera, 
  Save, 
  Edit,
  Settings,
  Bell,
  Shield,
  Globe,
  Eye,
  Download,
  FileText,
  Award,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { useAppDispatch, useAppSelector, useAuth } from '../hooks';
import { updateUser } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';
import clsx from 'clsx';

interface ProfileFormData {
  fullName: string;
  email: string;
  institution?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

interface NotificationSettings {
  emailComments: boolean;
  emailNewArticles: boolean;
  emailUpdates: boolean;
  pushComments: boolean;
  pushNewArticles: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showEmail: boolean;
  showInstitution: boolean;
  showStats: boolean;
}

const profileSchema = yup.object({
  fullName: yup
    .string()
    .required('El nombre completo es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Formato de email inválido'),
  institution: yup
    .string()
    .optional()
    .max(100, 'La institución no puede exceder 100 caracteres'),
  bio: yup
    .string()
    .optional()
    .max(500, 'La biografía no puede exceder 500 caracteres'),
  location: yup
    .string()
    .optional()
    .max(100, 'La ubicación no puede exceder 100 caracteres'),
  website: yup
    .string()
    .optional()
    .url('Formato de URL inválido'),
  twitter: yup
    .string()
    .optional()
    .matches(/^@?[a-zA-Z0-9_]+$/, 'Formato de Twitter inválido'),
  linkedin: yup
    .string()
    .optional()
    .url('Formato de LinkedIn inválido'),
  github: yup
    .string()
    .optional()
    .matches(/^[a-zA-Z0-9_-]+$/, 'Formato de GitHub inválido'),
});

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { loading } = useAppSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'stats'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Mock user stats
  const userStats = {
    articlesPublished: 12,
    totalViews: 4532,
    totalDownloads: 891,
    totalCitations: 156,
    hIndex: 8,
    joinDate: '2023-01-15',
    lastActive: '2024-03-10'
  };

  // Mock notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailComments: true,
    emailNewArticles: false,
    emailUpdates: true,
    pushComments: true,
    pushNewArticles: true,
  });

  // Mock privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showInstitution: true,
    showStats: true,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      institution: user?.institution || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      twitter: user?.twitter || '',
      linkedin: user?.linkedin || '',
      github: user?.github || '',
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(updateUser(data));
      dispatch(addNotification({
        type: 'success',
        title: 'Perfil actualizado',
        message: 'Tu perfil ha sido actualizado correctamente'
      }));
      setIsEditing(false);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar el perfil'
      }));
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    dispatch(addNotification({
      type: 'info',
      title: 'Configuración actualizada',
      message: 'La configuración de notificaciones ha sido guardada'
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    dispatch(addNotification({
      type: 'info',
      title: 'Privacidad actualizada',
      message: 'La configuración de privacidad ha sido guardada'
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-accent-600"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-16 mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {user?.fullName?.charAt(0)}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="ml-6 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
              <p className="text-gray-600">@{user?.username}</p>
              {user?.institution && (
                <p className="text-sm text-gray-500 mt-1">
                  <Building className="w-4 h-4 inline mr-1" />
                  {user.institution}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profile', label: 'Perfil', icon: User },
              { id: 'stats', label: 'Estadísticas', icon: Award },
              { id: 'notifications', label: 'Notificaciones', icon: Bell },
              { id: 'privacy', label: 'Privacidad', icon: Shield }
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
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <input
                        {...register('fullName')}
                        type="text"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.fullName ? 'border-red-500' : ''}`}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        {...register('email')}
                        type="email"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.email ? 'border-red-500' : ''}`}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institución
                    </label>
                    <div className="relative">
                      <input
                        {...register('institution')}
                        type="text"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.institution ? 'border-red-500' : ''}`}
                        placeholder="Universidad o institución"
                      />
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.institution && (
                      <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <div className="relative">
                      <input
                        {...register('location')}
                        type="text"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.location ? 'border-red-500' : ''}`}
                        placeholder="Ciudad, País"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                    )}
                  </div>
                </div>

                {/* Bio and Social Links */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Biografía y Enlaces</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía
                    </label>
                    <textarea
                      {...register('bio')}
                      disabled={!isEditing}
                      rows={4}
                      className={`input-field resize-none ${!isEditing ? 'bg-gray-50' : ''} ${errors.bio ? 'border-red-500' : ''}`}
                      placeholder="Cuéntanos sobre ti, tu investigación e intereses..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.bio && (
                        <p className="text-sm text-red-600">{errors.bio.message}</p>
                      )}
                      <p className="text-sm text-gray-500 ml-auto">
                        {watch('bio')?.length || 0}/500 caracteres
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sitio Web
                    </label>
                    <div className="relative">
                      <input
                        {...register('website')}
                        type="url"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.website ? 'border-red-500' : ''}`}
                        placeholder="https://tu-sitio-web.com"
                      />
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter
                      </label>
                      <div className="relative">
                        <input
                          {...register('twitter')}
                          type="text"
                          disabled={!isEditing}
                          className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.twitter ? 'border-red-500' : ''}`}
                          placeholder="@usuario"
                        />
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.twitter && (
                        <p className="mt-1 text-sm text-red-600">{errors.twitter.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <div className="relative">
                        <input
                          {...register('linkedin')}
                          type="url"
                          disabled={!isEditing}
                          className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.linkedin ? 'border-red-500' : ''}`}
                          placeholder="https://linkedin.com/in/usuario"
                        />
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.linkedin && (
                        <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub
                      </label>
                      <div className="relative">
                        <input
                          {...register('github')}
                          type="text"
                          disabled={!isEditing}
                          className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${errors.github ? 'border-red-500' : ''}`}
                          placeholder="usuario"
                        />
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.github && (
                        <p className="mt-1 text-sm text-red-600">{errors.github.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-outline"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isDirty}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Estadísticas de Perfil</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Artículos Publicados</p>
                      <p className="text-3xl font-bold">{userStats.articlesPublished}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total de Vistas</p>
                      <p className="text-3xl font-bold">{userStats.totalViews.toLocaleString()}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Descargas</p>
                      <p className="text-3xl font-bold">{userStats.totalDownloads}</p>
                    </div>
                    <Download className="w-8 h-8 text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Citas</p>
                      <p className="text-3xl font-bold">{userStats.totalCitations}</p>
                    </div>
                    <Award className="w-8 h-8 text-orange-200" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información Académica</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Índice H</span>
                      <span className="font-medium text-lg">{userStats.hIndex}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Miembro desde</span>
                      <span className="font-medium">{formatDate(userStats.joinDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Última actividad</span>
                      <span className="font-medium">{formatDate(userStats.lastActive)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Impacto por Artículo</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vistas promedio</span>
                      <span className="font-medium">{Math.round(userStats.totalViews / userStats.articlesPublished)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Descargas promedio</span>
                      <span className="font-medium">{Math.round(userStats.totalDownloads / userStats.articlesPublished)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Citas promedio</span>
                      <span className="font-medium">{Math.round(userStats.totalCitations / userStats.articlesPublished)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Configuración de Notificaciones</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Notificaciones por Email</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Comentarios en mis artículos</p>
                        <p className="text-sm text-gray-500">Recibir email cuando alguien comente en tus artículos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailComments}
                          onChange={(e) => handleNotificationChange('emailComments', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Nuevos artículos de autores seguidos</p>
                        <p className="text-sm text-gray-500">Recibir email cuando publiquen nuevos artículos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailNewArticles}
                          onChange={(e) => handleNotificationChange('emailNewArticles', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Actualizaciones de la plataforma</p>
                        <p className="text-sm text-gray-500">Recibir email sobre nuevas características y actualizaciones</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailUpdates}
                          onChange={(e) => handleNotificationChange('emailUpdates', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Notificaciones Push</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Comentarios</p>
                        <p className="text-sm text-gray-500">Notificaciones push para comentarios</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.pushComments}
                          onChange={(e) => handleNotificationChange('pushComments', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Nuevos artículos</p>
                        <p className="text-sm text-gray-500">Notificaciones push para nuevos artículos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.pushNewArticles}
                          onChange={(e) => handleNotificationChange('pushNewArticles', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Configuración de Privacidad</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Visibilidad del Perfil</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Quién puede ver tu perfil?
                      </label>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="input-field"
                      >
                        <option value="public">Público - Cualquiera puede ver mi perfil</option>
                        <option value="private">Privado - Solo usuarios registrados</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Información Visible</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Mostrar email</p>
                        <p className="text-sm text-gray-500">Permitir que otros usuarios vean tu email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.showEmail}
                          onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Mostrar institución</p>
                        <p className="text-sm text-gray-500">Mostrar tu institución en el perfil público</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.showInstitution}
                          onChange={(e) => handlePrivacyChange('showInstitution', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Mostrar estadísticas</p>
                        <p className="text-sm text-gray-500">Mostrar estadísticas de publicaciones y citas</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.showStats}
                          onChange={(e) => handlePrivacyChange('showStats', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;