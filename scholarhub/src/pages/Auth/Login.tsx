import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';
import { useAppDispatch } from '../../hooks';
import { loginUser } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/uiSlice';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Ingresa un email válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  rememberMe: yup.boolean(),
});

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await dispatch(loginUser({
        email: data.email,
        password: data.password,
      }));

      if (loginUser.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          title: 'Inicio de sesión exitoso',
          message: `¡Bienvenido/a ${result.payload.user.fullName}!`,
        }));
        navigate(from, { replace: true });
      } else {
        dispatch(addNotification({
          type: 'error',
          title: 'Error al iniciar sesión',
          message: result.payload as string || 'Credenciales inválidas',
        }));
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Ocurrió un error inesperado',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'autor' | 'admin') => {
    setIsLoading(true);
    try {
      const result = await dispatch(loginUser({
        email: role === 'admin' ? 'admin@scholarhub.com' : 'demo@scholarhub.com',
        password: 'demo123',
      }));

      if (loginUser.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          title: 'Demo iniciado',
          message: `Bienvenido al modo demo como ${role}`,
        }));
        navigate(from, { replace: true });
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo iniciar el modo demo',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-6">
              <BookOpen className="w-10 h-10 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">ScholarHub</h1>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Accede a tu cuenta para gestionar tus publicaciones académicas
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <div className="mt-1">
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/auth/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Demo buttons */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O prueba el demo</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={() => handleDemoLogin('autor')}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Demo Autor
                </button>
                <button
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Demo Admin
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/auth/register"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 gradient-primary flex items-center justify-center">
          <div className="text-center text-white p-8">
            <BookOpen className="w-24 h-24 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">
              Bienvenido a ScholarHub
            </h2>
            <p className="text-xl opacity-90 max-w-md">
              La plataforma integral para la gestión y publicación de artículos académicos
            </p>
            <div className="mt-8 space-y-4 text-left max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Gestiona tus publicaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Busca por autor y fecha</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Exporta a PDF y Word</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Editor de texto avanzado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;