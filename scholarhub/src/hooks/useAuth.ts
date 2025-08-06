import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './';
import { verifyToken } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, token } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (token && !isAuthenticated && !loading) {
      dispatch(verifyToken());
    }
  }, [dispatch, token, isAuthenticated, loading]);

  const isAdmin = user?.role === 'admin';
  const isAuthor = user?.role === 'autor';

  return {
    user,
    isAuthenticated,
    loading,
    error,
    isAdmin,
    isAuthor,
    token,
  };
};