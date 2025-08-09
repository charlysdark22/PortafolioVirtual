import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'autor' | 'admin';
  fullName: string;
  institution?: string;
  bio?: string;
  avatar?: string;
  registrationDate: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulamos API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        username: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'autor',
        fullName: 'Usuario Demo',
        institution: 'Universidad Tecnológica',
        bio: 'Investigador especializado en tecnología',
        registrationDate: new Date().toISOString(),
      };

      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      
      return { user: mockUser, token };
    } catch (error) {
      return rejectWithValue('Error al iniciar sesión');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    institution?: string;
    role: 'autor' | 'admin';
  }, { rejectWithValue }) => {
    try {
      // Simulamos API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: userData.role,
        fullName: userData.fullName,
        institution: userData.institution,
        registrationDate: new Date().toISOString(),
      };

      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      
      return { user: newUser, token };
    } catch (error) {
      return rejectWithValue('Error al registrar usuario');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    return null;
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Simulamos verificación de token
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        username: 'usuario_demo',
        email: 'demo@scholarhub.com',
        role: 'autor',
        fullName: 'Usuario Demo',
        institution: 'Universidad Tecnológica',
        registrationDate: new Date().toISOString(),
      };

      return { user: mockUser, token };
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue('Token inválido');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;