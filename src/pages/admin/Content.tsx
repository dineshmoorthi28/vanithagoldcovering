import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../utils/api';
import { useBranding } from '../../context/BrandingContext';

export default function AdminContent() {
  const [content, setContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { updateBranding } = useBranding();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await api.get('/content');
      setContent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post('/content', content);

      // Persist branding to context and localStorage for instant reflection
      updateBranding(content.logo_url || null, content.shop_name || 'Vanitha Gold Covering');

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setContent({ ...content, logo_url: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (key: string, value: string) => {
    setContent({ ...content, [key]: value });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-stone-900">Logo & Branding</h2>
          <p className="text-stone-500">Customize your shop name, logo, and brand colors</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Branding Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500">
                  <span className="font-serif text-xl">T</span>
                </div>
                <h3 className="text-lg font-bold text-stone-800">Shop Name</h3>
              </div>
              <input
                type="text"
                value={content.shop_name || ''}
                onChange={(e) => handleChange('shop_name', e.target.value)}
                placeholder="e.g. Vanitha Gold Covering"
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold-500 outline-none font-medium text-stone-900"
              />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500">
                    <Upload size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-stone-800">Logo Image</h3>
                </div>
                {content.logo_url && (
                  <button
                    onClick={() => handleChange('logo_url', '')}
                    className="text-red-500 hover:text-red-600 text-xs font-bold"
                  >
                    Remove Logo
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full px-6 py-10 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-gold-400 transition-all">
                    <Upload className="text-stone-400 mb-4" size={32} />
                    <span className="text-sm font-bold text-stone-600">Click to upload brand logo</span>
                    <span className="text-xs text-stone-400 mt-2">Supports Base64 auto-conversion</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Or Logo URL</label>
                  <input
                    type="text"
                    value={content.logo_url || ''}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold-500 outline-none text-stone-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 p-8 flex flex-col items-center justify-center relative min-h-[300px]">
            <span className="absolute top-6 left-8 text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">Live Preview</span>

            <div className="bg-white p-12 rounded-2xl shadow-xl w-full flex items-center justify-center">
              {content.logo_url ? (
                <img src={content.logo_url} alt="Preview" className="h-16 w-auto drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
              ) : (
                <div className="text-center">
                  <h4 className="text-3xl font-serif font-bold text-gold-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]">
                    {content.shop_name || 'Vanitha Gold Covering'}
                  </h4>
                </div>
              )}
            </div>
            <p className="mt-6 text-xs text-stone-400">This is how your brand will appear in the navigation bar</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
          <h3 className="text-xl font-serif font-bold text-stone-900 mb-6 flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-gold-100 text-gold-700 flex items-center justify-center text-sm">1</span>
            <span>Hero Section</span>
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Hero Title</label>
              <input
                type="text"
                value={content.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Hero Subtitle</label>
              <textarea
                value={content.hero_subtitle || ''}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
          <h3 className="text-xl font-serif font-bold text-stone-900 mb-6 flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-gold-100 text-gold-700 flex items-center justify-center text-sm">2</span>
            <span>About Section</span>
          </h3>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">About Us Text</label>
            <textarea
              value={content.about_text || ''}
              onChange={(e) => handleChange('about_text', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
            ></textarea>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
          <h3 className="text-xl font-serif font-bold text-stone-900 mb-6 flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-gold-100 text-gold-700 flex items-center justify-center text-sm">3</span>
            <span>Contact Information</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={content.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
              <input
                type="email"
                value={content.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-2">Store Address</label>
              <input
                type="text"
                value={content.contact_address || ''}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-2">Instagram URL</label>
              <input
                type="text"
                value={content.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-[100]"
          >
            <CheckCircle size={24} />
            <span className="font-bold">Changes saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
