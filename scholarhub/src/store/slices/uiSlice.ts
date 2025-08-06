import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface Modal {
  isOpen: boolean;
  type: 'confirm' | 'info' | 'form' | null;
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface UiState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
  modal: Modal;
  loading: {
    global: boolean;
    components: Record<string, boolean>;
  };
  searchQuery: string;
  currentView: 'list' | 'grid';
  pageTitle: string;
}

const initialState: UiState = {
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
  },
  loading: {
    global: false,
    components: {},
  },
  searchQuery: '',
  currentView: 'list',
  pageTitle: 'ScholarHub',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        duration: action.payload.duration || 5000,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<Omit<Modal, 'isOpen'>>) => {
      state.modal = {
        ...action.payload,
        isOpen: true,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
      };
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      state.loading.components[action.payload.component] = action.payload.loading;
    },
    clearComponentLoading: (state, action: PayloadAction<string>) => {
      delete state.loading.components[action.payload];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<'list' | 'grid'>) => {
      state.currentView = action.payload;
      localStorage.setItem('currentView', action.payload);
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
      document.title = `${action.payload} - ScholarHub`;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setGlobalLoading,
  setComponentLoading,
  clearComponentLoading,
  setSearchQuery,
  setCurrentView,
  setPageTitle,
} = uiSlice.actions;

export default uiSlice.reducer;