import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAuth } from './hooks';

// Components
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import NotificationContainer from './components/UI/NotificationContainer';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import ArticleView from './pages/Articles/ArticleView';
import ArticleEditor from './pages/Articles/ArticleEditor';
import Search from './pages/Search';
import Profile from './pages/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Import Quill styles
import 'react-quill/dist/quill.snow.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="articles/:id" element={<ArticleView />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route 
              path="login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              } 
            />
            <Route 
              path="register" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
              } 
            />
          </Route>

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<Articles />} />
            <Route path="articles/new" element={<ArticleEditor />} />
            <Route path="articles/edit/:id" element={<ArticleEditor />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <NotificationContainer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
