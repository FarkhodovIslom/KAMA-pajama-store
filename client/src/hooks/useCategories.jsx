
import { useState, useEffect, createContext, useContext } from 'react';
import { api } from '../lib/api';

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await api.get('/api/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (category) => {
    const newCat = await api.post('/api/categories', category);
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = async (id, updates) => {
    const updated = await api.put(`/api/categories/${id}`, updates);
    setCategories(prev => prev.map(cat => cat.id === id ? updated : cat));
    return updated;
  };

  const deleteCategory = async (id) => {
    await api.delete(`/api/categories/${id}`);
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const getCategoryById = (id) => categories.find(cat => cat.id === id);
  const getCategoryByName = (name) => categories.find(cat => cat.name === name);

  return (
    <CategoriesContext.Provider value={{
      categories,
      loading,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategoryById,
      getCategoryByName,
    }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoriesProvider');
  }
  return context;
}
