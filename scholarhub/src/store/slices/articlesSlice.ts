import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authSlice';

export interface Article {
  id: string;
  title: string;
  content: string;
  abstract: string;
  author: User;
  coAuthors?: User[];
  keywords: string[];
  category: string;
  publicationDate: string;
  lastModified: string;
  doi?: string;
  journal?: string;
  conference?: string;
  status: 'draft' | 'published' | 'under_review';
  views: number;
  downloads: number;
  fileUrl?: string;
  isFavorite?: boolean;
}

export interface SearchFilters {
  query?: string;
  author?: string;
  category?: string;
  keywords?: string[];
  startYear?: number;
  endYear?: number;
  status?: 'draft' | 'published' | 'under_review';
}

interface ArticlesState {
  articles: Article[];
  myArticles: Article[];
  favorites: Article[];
  searchResults: Article[];
  currentArticle: Article | null;
  filters: SearchFilters;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialState: ArticlesState = {
  articles: [],
  myArticles: [],
  favorites: [],
  searchResults: [],
  currentArticle: null,
  filters: {},
  loading: false,
  searchLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

// Mock data
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Inteligencia Artificial en la Educación Superior',
    content: '<h2>Introducción</h2><p>La inteligencia artificial está transformando la educación...</p>',
    abstract: 'Este artículo examina el impacto de la IA en la educación superior y sus implicaciones futuras.',
    author: {
      id: '1',
      username: 'dr_garcia',
      email: 'garcia@universidad.edu',
      role: 'autor',
      fullName: 'Dr. María García',
      institution: 'Universidad Nacional',
      registrationDate: '2023-01-15',
    },
    keywords: ['inteligencia artificial', 'educación', 'tecnología educativa'],
    category: 'Inteligencia Artificial',
    publicationDate: '2024-01-15',
    lastModified: '2024-01-20',
    status: 'published',
    views: 250,
    downloads: 45,
    journal: 'Revista de Tecnología Educativa',
  },
  {
    id: '2',
    title: 'Desarrollo de Software Sostenible: Metodologías Verdes',
    content: '<h2>Resumen</h2><p>Las metodologías de desarrollo sostenible son fundamentales...</p>',
    abstract: 'Análisis de las mejores prácticas para el desarrollo de software sostenible.',
    author: {
      id: '2',
      username: 'ing_lopez',
      email: 'lopez@tech.com',
      role: 'autor',
      fullName: 'Ing. Carlos López',
      institution: 'Instituto Tecnológico',
      registrationDate: '2023-03-10',
    },
    keywords: ['desarrollo sostenible', 'software', 'metodologías ágiles'],
    category: 'Ingeniería de Software',
    publicationDate: '2024-02-10',
    lastModified: '2024-02-15',
    status: 'published',
    views: 180,
    downloads: 32,
    conference: 'Conferencia Internacional de Software',
  },
];

// Async thunks
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (params: { page?: number; limit?: number } = {}) => {
    // Simulamos API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const { page = 1, limit = 10 } = params;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      articles: mockArticles.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockArticles.length / limit),
        totalItems: mockArticles.length,
        itemsPerPage: limit,
      },
    };
  }
);

export const searchArticles = createAsyncThunk(
  'articles/searchArticles',
  async (filters: SearchFilters) => {
    // Simulamos API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let results = [...mockArticles];
    
    if (filters.query) {
      results = results.filter(article =>
        article.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
        article.abstract.toLowerCase().includes(filters.query!.toLowerCase()) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(filters.query!.toLowerCase()))
      );
    }
    
    if (filters.author) {
      results = results.filter(article =>
        article.author.fullName.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }
    
    if (filters.category) {
      results = results.filter(article => article.category === filters.category);
    }
    
    if (filters.startYear || filters.endYear) {
      results = results.filter(article => {
        const year = new Date(article.publicationDate).getFullYear();
        const start = filters.startYear || 1900;
        const end = filters.endYear || 2100;
        return year >= start && year <= end;
      });
    }
    
    return results;
  }
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id: string) => {
    // Simulamos API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const article = mockArticles.find(a => a.id === id);
    if (!article) {
      throw new Error('Artículo no encontrado');
    }
    
    return article;
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData: Omit<Article, 'id' | 'publicationDate' | 'lastModified' | 'views' | 'downloads'>) => {
    // Simulamos API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      publicationDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      views: 0,
      downloads: 0,
    };
    
    return newArticle;
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, data }: { id: string; data: Partial<Article> }) => {
    // Simulamos API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id,
      data: {
        ...data,
        lastModified: new Date().toISOString(),
      },
    };
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id: string) => {
    // Simulamos API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return id;
  }
);

export const toggleFavorite = createAsyncThunk(
  'articles/toggleFavorite',
  async (articleId: string) => {
    // Simulamos API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return articleId;
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentArticle: (state, action: PayloadAction<Article | null>) => {
      state.currentArticle = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    incrementViews: (state, action: PayloadAction<string>) => {
      const article = state.articles.find(a => a.id === action.payload);
      if (article) {
        article.views += 1;
      }
      if (state.currentArticle?.id === action.payload) {
        state.currentArticle.views += 1;
      }
    },
    incrementDownloads: (state, action: PayloadAction<string>) => {
      const article = state.articles.find(a => a.id === action.payload);
      if (article) {
        article.downloads += 1;
      }
      if (state.currentArticle?.id === action.payload) {
        state.currentArticle.downloads += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar artículos';
      })
      // Search Articles
      .addCase(searchArticles.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Error en la búsqueda';
      })
      // Fetch Article by ID
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar artículo';
      })
      // Create Article
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles.unshift(action.payload);
        state.myArticles.unshift(action.payload);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al crear artículo';
      })
      // Update Article
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        
        const updateArticleInArray = (articles: Article[]) => {
          const index = articles.findIndex(a => a.id === id);
          if (index !== -1) {
            articles[index] = { ...articles[index], ...data };
          }
        };
        
        updateArticleInArray(state.articles);
        updateArticleInArray(state.myArticles);
        updateArticleInArray(state.searchResults);
        
        if (state.currentArticle?.id === id) {
          state.currentArticle = { ...state.currentArticle, ...data };
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al actualizar artículo';
      })
      // Delete Article
      .addCase(deleteArticle.fulfilled, (state, action) => {
        const id = action.payload;
        state.articles = state.articles.filter(a => a.id !== id);
        state.myArticles = state.myArticles.filter(a => a.id !== id);
        state.searchResults = state.searchResults.filter(a => a.id !== id);
        state.favorites = state.favorites.filter(a => a.id !== id);
        
        if (state.currentArticle?.id === id) {
          state.currentArticle = null;
        }
      })
      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const articleId = action.payload;
        const article = state.articles.find(a => a.id === articleId);
        
        if (article) {
          const isFavorite = state.favorites.some(f => f.id === articleId);
          
          if (isFavorite) {
            state.favorites = state.favorites.filter(f => f.id !== articleId);
            article.isFavorite = false;
          } else {
            state.favorites.push(article);
            article.isFavorite = true;
          }
          
          if (state.currentArticle?.id === articleId) {
            state.currentArticle.isFavorite = !isFavorite;
          }
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentArticle,
  clearError,
  incrementViews,
  incrementDownloads,
} = articlesSlice.actions;

export default articlesSlice.reducer;