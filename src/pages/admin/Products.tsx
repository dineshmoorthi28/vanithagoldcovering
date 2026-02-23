import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, X, Upload, Check, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../utils/api';
import { Product, Category } from '../../types';

const SUB_CATEGORIES_MAP: Record<string, string[]> = {
  'Earrings': ['Stud', 'Jhumka', 'Hoop', 'Drop', 'Chandbali'],
  'Necklace': ['Long Chain', 'Short Chain', 'Haram', 'Dollar Chain', 'Pendant Set'],
  'Bridal Sets': ['Full Bridal Combo', 'Temple Bridal Set', 'Antique Bridal Set'],
  'Bangles': [],
  'Rings': []
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    subCategory: '',
    status: 'Standard'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageUrl(''); // Clear URL if file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.price || !formData.category) {
      setNotification({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    // Category-Image Consistency Check
    const categoryLower = formData.category.toLowerCase();
    const isMismatch = (
      (categoryLower.includes('ring') && !previewUrl.toLowerCase().includes('ring')) ||
      (categoryLower.includes('earring') && !previewUrl.toLowerCase().includes('jhumka') && !previewUrl.toLowerCase().includes('earring')) ||
      (categoryLower.includes('bangle') && !previewUrl.toLowerCase().includes('bangle')) ||
      (categoryLower.includes('necklace') && !previewUrl.toLowerCase().includes('necklace') && !previewUrl.toLowerCase().includes('haram') && !previewUrl.toLowerCase().includes('chain')) ||
      (categoryLower.includes('bridal') && !previewUrl.toLowerCase().includes('bridal') && !previewUrl.toLowerCase().includes('set'))
    );

    if (isMismatch && !window.confirm(`Potential mismatch: The image may not match the category "${formData.category}". Do you want to save anyway?`)) {
      return;
    }

    setIsSaving(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (uploadMethod === 'file' && selectedFile) {
      data.append('image', selectedFile);
    } else if (uploadMethod === 'url' && imageUrl) {
      data.append('image', imageUrl);
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data);

        // Update local state using ID
        const updatedProduct = {
          ...editingProduct,
          ...formData,
          price: parseFloat(formData.price),
          oldPrice: parseFloat(formData.oldPrice),
          subCategory: formData.subCategory
        };
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...updatedProduct } : p));

        setNotification({ type: 'success', message: 'Product updated successfully!' });
      } else {
        const res = await api.post('/products', data);

        // Add to local state
        const newProduct = {
          id: res.data.id,
          ...formData,
          price: parseFloat(formData.price),
          oldPrice: parseFloat(formData.oldPrice),
          subCategory: formData.subCategory,
          image: uploadMethod === 'url' ? imageUrl : (res.data.image || previewUrl)
        } as Product;
        setProducts(prev => [...prev, newProduct]);

        setNotification({ type: 'success', message: 'Product added successfully!' });
      }
      setIsModalOpen(false);
      resetForm();
      // fetchProducts(); // Still good to have as a fallback, but we update locally now
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.error || 'Failed to save product. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.oldPrice.toString(),
      category: product.category,
      subCategory: product.subCategory || '',
      status: product.status
    });

    if (product.image.startsWith('http')) {
      setUploadMethod('url');
      setImageUrl(product.image);
      setPreviewUrl(product.image);
    } else {
      setUploadMethod('file');
      setPreviewUrl(product.image);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      category: '',
      subCategory: '',
      status: 'Standard'
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setImageUrl('');
    setUploadMethod('file');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProduct = (id: number) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleExport = (mode: 'all' | 'selected') => {
    try {
      const dataToExport = mode === 'all'
        ? products
        : products.filter(p => selectedProductIds.includes(p.id));

      if (dataToExport.length === 0) {
        setNotification({ type: 'error', message: 'No products selected for export.' });
        return;
      }

      const headers = ['Product Name', 'Category', 'Sub Category', 'Price', 'Old Price', 'Status', 'Image URL', 'Description'];
      const csvRows = [
        headers.join(','),
        ...dataToExport.map(p => [
          `"${(p.name || '').replace(/"/g, '""')}"`,
          `"${(p.category || '').replace(/"/g, '""')}"`,
          `"${(p.subCategory || '').replace(/"/g, '""')}"`,
          p.price,
          p.oldPrice,
          `"${(p.status || 'Standard').replace(/"/g, '""')}"`,
          `"${(p.image || '').replace(/"/g, '""')}"`,
          `"${(p.description || '').replace(/"/g, '""')}"`
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', mode === 'all' ? 'all_products.csv' : 'selected_products.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setNotification({ type: 'success', message: `Exported ${dataToExport.length} products successfully!` });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to export products. Please try again.' });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim().length > 0);
        if (rows.length < 2) throw new Error('CSV file is empty or invalid.');

        const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const productsToImport = rows.slice(1).map(row => {
          // Simple CSV parser that handles quotes
          const values: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < row.length; i++) {
            if (row[i] === '"') inQuotes = !inQuotes;
            else if (row[i] === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else current += row[i];
          }
          values.push(current.trim());

          const p: any = {};
          headers.forEach((header, index) => {
            const h = header.toLowerCase();
            const val = values[index]?.replace(/"/g, '');
            if (h.includes('name')) p.name = val;
            else if (h.includes('category') && !h.includes('sub')) p.category = val;
            else if (h.includes('sub category') || h.includes('subcategory')) p.subCategory = val;
            else if (h.includes('price') && !h.includes('old')) p.price = val;
            else if (h.includes('old price') || h.includes('original')) p.oldPrice = val;
            else if (h.includes('status')) p.status = val;
            else if (h.includes('image')) p.image = val;
            else if (h.includes('description')) p.description = val;
          });
          return p;
        });

        setIsSaving(true);
        let successCount = 0;
        for (const p of productsToImport) {
          try {
            const data = new FormData();
            Object.entries(p).forEach(([key, value]) => {
              if (value !== undefined) data.append(key, value.toString());
            });
            await api.post('/products', data);
            successCount++;
          } catch (err) {
            console.error(`Failed to import product ${p.name}:`, err);
          }
        }

        setNotification({ type: 'success', message: `Successfully imported ${successCount} products!` });
        fetchProducts();
      } catch (err: any) {
        console.error(err);
        setNotification({ type: 'error', message: err.message || 'Failed to import CSV.' });
      } finally {
        setIsSaving(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-gold-500 outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleExport('selected')}
            disabled={selectedProductIds.length === 0}
            className={`px-4 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-md flex-1 sm:flex-none justify-center ${selectedProductIds.length === 0
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
          >
            <Download size={18} />
            <span>Export Selected ({selectedProductIds.length})</span>
          </button>

          <button
            onClick={() => handleExport('all')}
            className="bg-white text-stone-700 border border-stone-200 px-4 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-stone-50 transition-all shadow-md flex-1 sm:flex-none justify-center"
          >
            <Download size={18} />
            <span>Export All</span>
          </button>

          <div className="relative flex-1 sm:flex-none">
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="csv-import"
            />
            <button
              className="bg-stone-900 text-white px-4 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-stone-800 transition-all shadow-md w-full justify-center"
            >
              <Upload size={18} />
              <span>Import CSV</span>
            </button>
          </div>

          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-maroon-900 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-maroon-800 transition-all shadow-lg flex-1 sm:flex-none justify-center"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-medium w-12">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                    className="w-4 h-4 text-maroon-600 rounded focus:ring-maroon-500 border-stone-300"
                  />
                </th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className={`hover:bg-stone-50 transition-colors ${selectedProductIds.includes(product.id) ? 'bg-stone-50' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4 text-maroon-600 rounded focus:ring-maroon-500 border-stone-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{product.name}</p>
                        <p className="text-xs text-stone-500 truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-600 block">{product.category}</span>
                    <span className="text-xs text-stone-400">{product.subCategory}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-maroon-900">₹{product.price}</p>
                    <p className="text-xs text-stone-400 line-through">₹{product.oldPrice}</p>
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'Featured' && (
                      <span className="px-2 py-1 bg-gold-100 text-gold-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-maroon-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: '' })}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    {formData.category && SUB_CATEGORIES_MAP[formData.category]?.length > 0 && (
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Sub Category</label>
                        <select
                          value={formData.subCategory}
                          onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                        >
                          <option value="">Select Sub Category</option>
                          {SUB_CATEGORIES_MAP[formData.category].map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Price (₹)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Original Price (₹)</label>
                        <input
                          type="number"
                          value={formData.oldPrice}
                          onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-stone-700">Product Image</label>
                      <div className="flex bg-stone-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setUploadMethod('file')}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${uploadMethod === 'file' ? 'bg-white text-maroon-900 shadow-sm' : 'text-stone-500'}`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadMethod('url')}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${uploadMethod === 'url' ? 'bg-white text-maroon-900 shadow-sm' : 'text-stone-500'}`}
                        >
                          Image URL
                        </button>
                      </div>
                    </div>

                    {uploadMethod === 'url' ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Paste image URL here..."
                          value={imageUrl}
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            setPreviewUrl(e.target.value);
                          }}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                        />
                        <div className="aspect-square rounded-2xl overflow-hidden border border-stone-200">
                          <img src={previewUrl} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative group aspect-square rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center overflow-hidden bg-stone-50 hover:bg-stone-100 transition-all">
                        {previewUrl ? (
                          <>
                            <img src={previewUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}
                                className="bg-white text-red-600 p-2 rounded-full"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="text-stone-400 mb-2" size={32} />
                            <span className="text-xs text-stone-500">Click to upload image</span>
                          </>
                        )}
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.status === 'Featured'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Featured' : 'Standard' })}
                    className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
                  />
                  <label htmlFor="is_featured" className="text-sm font-bold text-stone-700">Mark as Featured Product</label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-maroon-900 text-white rounded-xl font-bold hover:bg-maroon-800 transition-all shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Check size={20} />
                    <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-12 left-1/2 px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-[100] text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}
          >
            {notification.type === 'success' ? <Check size={24} /> : <X size={24} />}
            <span className="font-bold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
