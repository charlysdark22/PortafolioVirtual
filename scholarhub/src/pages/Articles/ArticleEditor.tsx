import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuill from 'react-quill';
import { 
  Save, 
  Eye, 
  Upload, 
  Plus, 
  X, 
  FileText, 
  User, 
  Tag, 
  Calendar,
  Globe,
  Book,
  Award,
  ArrowLeft
} from 'lucide-react';
import { useAppDispatch, useAppSelector, useAuth } from '../../hooks';
import { createArticle, updateArticle, fetchArticleById } from '../../store/slices/articlesSlice';
import { addNotification } from '../../store/slices/uiSlice';

interface ArticleFormData {
  title: string;
  abstract: string;
  content: string;
  keywords: string[];
  category: string;
  doi?: string;
  journal?: string;
  conference?: string;
  status: 'draft' | 'published' | 'under_review';
  coAuthors?: string[];
}

const schema = yup.object({
  title: yup
    .string()
    .required('El título es requerido')
    .min(10, 'El título debe tener al menos 10 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  abstract: yup
    .string()
    .required('El resumen es requerido')
    .min(100, 'El resumen debe tener al menos 100 caracteres')
    .max(1000, 'El resumen no puede exceder 1000 caracteres'),
  content: yup
    .string()
    .required('El contenido es requerido')
    .min(500, 'El contenido debe tener al menos 500 caracteres'),
  keywords: yup
    .array()
    .of(yup.string())
    .min(3, 'Debe incluir al menos 3 palabras clave')
    .max(10, 'No puede incluir más de 10 palabras clave'),
  category: yup
    .string()
    .required('La categoría es requerida'),
  doi: yup
    .string()
    .optional()
    .matches(/^10\.\d{4,}\/[-._;()\/:A-Za-z0-9]+$/, 'Formato de DOI inválido'),
  journal: yup.string().optional(),
  conference: yup.string().optional(),
  status: yup
    .string()
    .oneOf(['draft', 'published', 'under_review'])
    .required('El estado es requerido'),
});

const ArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  const { currentArticle, loading } = useAppSelector(state => state.articles);
  
  const [keywordInput, setKeywordInput] = useState('');
  const [coAuthorInput, setCoAuthorInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isEditing = Boolean(id);

  const categories = [
    'Inteligencia Artificial',
    'Ingeniería de Software',
    'Ciencias de Datos',
    'Ciberseguridad',
    'Redes y Comunicaciones',
    'Bases de Datos',
    'Interfaces Humano-Computador',
    'Computación Distribuida',
    'Algoritmos y Estructuras',
    'Sistemas Operativos',
    'Robótica',
    'Visión por Computador',
    'Procesamiento de Lenguaje Natural',
    'Blockchain',
    'Internet de las Cosas'
  ];

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isDirty }
  } = useForm<ArticleFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      abstract: '',
      content: '',
      keywords: [],
      category: '',
      doi: '',
      journal: '',
      conference: '',
      status: 'draft',
      coAuthors: []
    }
  });

  const watchedKeywords = watch('keywords');
  const watchedCoAuthors = watch('coAuthors');
  const watchedContent = watch('content');

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'formula'],
        ['code-block', 'blockquote'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video', 'formula',
    'code-block', 'blockquote'
  ];

  // Load article for editing
  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchArticleById(id));
    }
  }, [dispatch, isEditing, id]);

  // Populate form when article is loaded
  useEffect(() => {
    if (currentArticle && isEditing) {
      setValue('title', currentArticle.title);
      setValue('abstract', currentArticle.abstract);
      setValue('content', currentArticle.content);
      setValue('keywords', currentArticle.keywords);
      setValue('category', currentArticle.category);
      setValue('doi', currentArticle.doi || '');
      setValue('journal', currentArticle.journal || '');
      setValue('conference', currentArticle.conference || '');
      setValue('status', currentArticle.status);
      setValue('coAuthors', currentArticle.coAuthors?.map(author => author.fullName) || []);
    }
  }, [currentArticle, isEditing, setValue]);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && isEditing) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [isDirty, isEditing, watchedContent]);

  const handleAutoSave = async () => {
    if (isEditing && id && isDirty) {
      const data = getValues();
      try {
        await dispatch(updateArticle({
          id,
          data: {
            ...data,
            author: user!,
            lastModified: new Date().toISOString()
          }
        }));
        setLastSaved(new Date());
        dispatch(addNotification({
          type: 'info',
          title: 'Guardado automático',
          message: 'Los cambios se han guardado automáticamente',
          duration: 2000
        }));
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    setIsSaving(true);
    try {
      const articleData = {
        ...data,
        author: user!,
        coAuthors: data.coAuthors?.map(name => ({
          id: `temp-${Date.now()}`,
          username: name.toLowerCase().replace(/\s+/g, '_'),
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          role: 'autor' as const,
          fullName: name,
          registrationDate: new Date().toISOString()
        })) || []
      };

      if (isEditing && id) {
        await dispatch(updateArticle({ id, data: articleData }));
        dispatch(addNotification({
          type: 'success',
          title: 'Artículo actualizado',
          message: 'El artículo se ha actualizado correctamente'
        }));
      } else {
        const result = await dispatch(createArticle(articleData));
        if (createArticle.fulfilled.match(result)) {
          dispatch(addNotification({
            type: 'success',
            title: 'Artículo creado',
            message: 'El artículo se ha creado correctamente'
          }));
          navigate(`/dashboard/articles/edit/${result.payload.id}`);
        }
      }
      setLastSaved(new Date());
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo guardar el artículo'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !watchedKeywords.includes(keywordInput.trim())) {
      const newKeywords = [...watchedKeywords, keywordInput.trim()];
      setValue('keywords', newKeywords, { shouldDirty: true });
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = watchedKeywords.filter((_, i) => i !== index);
    setValue('keywords', newKeywords, { shouldDirty: true });
  };

  const addCoAuthor = () => {
    if (coAuthorInput.trim() && !watchedCoAuthors?.includes(coAuthorInput.trim())) {
      const newCoAuthors = [...(watchedCoAuthors || []), coAuthorInput.trim()];
      setValue('coAuthors', newCoAuthors, { shouldDirty: true });
      setCoAuthorInput('');
    }
  };

  const removeCoAuthor = (index: number) => {
    const newCoAuthors = (watchedCoAuthors || []).filter((_, i) => i !== index);
    setValue('coAuthors', newCoAuthors, { shouldDirty: true });
  };

  const handleQuickSave = () => {
    handleSubmit(onSubmit)();
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/articles')}
              className="btn-outline p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Artículo' : 'Nuevo Artículo'}
              </h1>
              {lastSaved && (
                <p className="text-sm text-gray-500 mt-1">
                  Guardado por última vez: {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="btn-outline flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {isPreview ? 'Editar' : 'Vista Previa'}
            </button>
            
            <button
              onClick={handleQuickSave}
              disabled={isSaving}
              className="btn-secondary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              className="btn-primary flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isEditing ? 'Actualizar' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>

      {isPreview ? (
        /* Preview Mode */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {watch('title') || 'Título del artículo'}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{user?.fullName}</span>
                  {watchedCoAuthors && watchedCoAuthors.length > 0 && (
                    <span>, {watchedCoAuthors.join(', ')}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date().toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{watch('category') || 'Sin categoría'}</span>
                </div>
              </div>

              {watch('journal') && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Book className="w-4 h-4 mr-1" />
                  <span>Revista: {watch('journal')}</span>
                </div>
              )}

              {watch('conference') && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Award className="w-4 h-4 mr-1" />
                  <span>Conferencia: {watch('conference')}</span>
                </div>
              )}

              {watch('doi') && (
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Globe className="w-4 h-4 mr-1" />
                  <span>DOI: {watch('doi')}</span>
                </div>
              )}
            </header>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Resumen</h2>
              <p className="text-gray-700 leading-relaxed">
                {watch('abstract') || 'Resumen del artículo...'}
              </p>
            </section>

            {watchedKeywords.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Palabras Clave</h2>
                <div className="flex flex-wrap gap-2">
                  {watchedKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contenido</h2>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: watch('content') || '<p>Contenido del artículo...</p>' 
                }}
              />
            </section>
          </article>
        </div>
      ) : (
        /* Edit Mode */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Título del Artículo *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="Ingresa el título de tu artículo..."
                  className={`input-field text-lg font-medium ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Abstract */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resumen *
                </label>
                <textarea
                  {...register('abstract')}
                  rows={6}
                  placeholder="Escribe un resumen conciso de tu artículo..."
                  className={`input-field resize-none ${errors.abstract ? 'border-red-500' : ''}`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.abstract && (
                    <p className="text-sm text-red-600">{errors.abstract.message}</p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {watch('abstract')?.length || 0}/1000 caracteres
                  </p>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido del Artículo *
                </label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={modules}
                      formats={formats}
                      placeholder="Escribe el contenido de tu artículo aquí..."
                      style={{ height: '400px', marginBottom: '50px' }}
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-sm text-red-600 mt-2">{errors.content.message}</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publication Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Publicación
                </label>
                <select
                  {...register('status')}
                  className="input-field"
                >
                  <option value="draft">Borrador</option>
                  <option value="under_review">En Revisión</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              {/* Category */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Categoría *
                </label>
                <select
                  {...register('category')}
                  className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Keywords */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palabras Clave *
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Agregar palabra clave"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="btn-outline p-2"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {watchedKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.keywords && (
                  <p className="mt-2 text-sm text-red-600">{errors.keywords.message}</p>
                )}
              </div>

              {/* Co-Authors */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Co-autores
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={coAuthorInput}
                    onChange={(e) => setCoAuthorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCoAuthor())}
                    placeholder="Nombre del co-autor"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={addCoAuthor}
                    className="btn-outline p-2"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {(watchedCoAuthors || []).map((coAuthor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                    >
                      <span className="text-sm">{coAuthor}</span>
                      <button
                        type="button"
                        onClick={() => removeCoAuthor(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publication Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Detalles de Publicación</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Book className="w-4 h-4 inline mr-1" />
                      Revista
                    </label>
                    <input
                      {...register('journal')}
                      type="text"
                      placeholder="Nombre de la revista"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Award className="w-4 h-4 inline mr-1" />
                      Conferencia
                    </label>
                    <input
                      {...register('conference')}
                      type="text"
                      placeholder="Nombre de la conferencia"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Globe className="w-4 h-4 inline mr-1" />
                      DOI
                    </label>
                    <input
                      {...register('doi')}
                      type="text"
                      placeholder="10.1000/182"
                      className={`input-field ${errors.doi ? 'border-red-500' : ''}`}
                    />
                    {errors.doi && (
                      <p className="mt-1 text-sm text-red-600">{errors.doi.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ArticleEditor;