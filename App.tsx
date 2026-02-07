import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, MessageCircle, Heart, Trash2, Plus, Minus, ArrowRight, Star, ShoppingBag, Filter } from 'lucide-react';
import { INITIAL_PRODUCTS, CARE_TIPS, SHOP_INFO } from './constants';
import { Product, Category, Material, CartItem } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/AdminDashboard';
import { useSettings } from './contexts/SettingsContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const HomePage: React.FC<{
  products: Product[];
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlistIds: Set<string>;
}> = ({ products, onAddToCart, onToggleWishlist, wishlistIds }) => {
  const { settings } = useSettings();
  const { hero, sections } = settings;

  return (
    <div className="bg-white">
      {/* Hero Section - Dynamic */}
      {hero.visible && (
        <section className="relative h-[600px] md:h-[800px] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#120404]">
          <div className="absolute inset-0 z-0">
            <img
              src={hero.backgroundImage || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop"}
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-110"
              alt="Traditional Jewellery Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505]/90 via-[#1a0505]/40 to-[#120404]"></div>
          </div>

          <div className="relative z-10 max-w-4xl px-4 flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h1 className="text-[48px] md:text-[90px] font-bold text-[#D4AF37] serif leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
              {hero.heading}
            </h1>

            <p className="text-white text-sm md:text-xl font-medium max-w-2xl mb-12 leading-relaxed opacity-90 drop-shadow-md">
              {hero.subheading}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {hero.primaryButtonText && (
                <Link
                  to={hero.primaryButtonLink}
                  className="px-12 py-4 bg-[#D4AF37] text-[#120404] text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-[0_15px_30px_rgba(212,175,55,0.2)] hover:bg-white hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  {hero.primaryButtonText}
                </Link>
              )}
              {hero.secondaryButtonText && (
                <Link
                  to={hero.secondaryButtonLink}
                  className="px-12 py-4 border-2 border-white text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-[#120404] transition-all duration-300 transform hover:-translate-y-1"
                >
                  {hero.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Render Dynamic Custom Sections */}
      {sections.filter(s => s.visible).sort((a, b) => a.order - b.order).map((section) => (
        <section key={section.id} className="py-24 border-b border-stone-100 last:border-0">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={section.id.includes('even') ? 'order-last' : ''}>
                <h2 className="text-3xl md:text-5xl font-bold text-[#2a0e0e] serif mb-8">{section.title}</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-10">{section.content}</p>
              </div>
              {section.imageUrl && (
                <div className="rounded-[2rem] overflow-hidden shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-500">
                  <img src={section.imageUrl} alt={section.title} className="w-full h-auto object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Original Categories Section */}
      <section className="bg-[#F9F5F0] py-24 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Browse Collections</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2a0e0e] serif">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {Object.values(Category).filter(c => c !== Category.RENTAL).map((cat) => {
              const categoryProduct = products.find(p => p.category === cat);
              return (
                <Link key={cat} to={`/catalog?category=${cat}`} className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-stone-100">
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-100 relative mb-4">
                    <img
                      src={categoryProduct?.image || `https://picsum.photos/seed/${cat}/300/300`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={cat}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  <div className="text-center pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#2a0e0e] group-hover:text-[#D4AF37] transition-colors">
                      {cat}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* Trust Messaging */}
      <section className="bg-maroon py-32 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gold rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h3 className="text-4xl md:text-6xl serif italic mb-10 text-gold drop-shadow-md">Crafted with Tradition</h3>
          <p className="max-w-2xl mx-auto text-white/70 font-light text-lg leading-relaxed mb-20 tracking-wide">
            Every piece in our collection is meticulously handcrafted by artisans using ancient techniques, ensuring you wear not just jewellery, but a piece of heritage.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center text-gold mb-6"><Star size={32} strokeWidth={1} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Quality First</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center text-gold mb-6"><Heart size={32} strokeWidth={1} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Skin Safe</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center text-gold mb-6"><MessageCircle size={32} strokeWidth={1} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Support</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center text-gold mb-6"><ArrowRight size={32} strokeWidth={1} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Express</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const CatalogPage: React.FC<{
  products: Product[];
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlistIds: Set<string>;
}> = ({ products, onAddToCart, onToggleWishlist, wishlistIds }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = searchParams.get('category') || 'All';
  const activeMaterial = searchParams.get('material') || 'All';

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchMat = activeMaterial === 'All' || p.material === activeMaterial;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchMat && matchSearch;
    });
  }, [products, activeCategory, activeMaterial, searchQuery]);

  const handleCategoryChange = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === 'All') newParams.delete('category');
    else newParams.set('category', val);
    setSearchParams(newParams);
  };

  const handleMaterialChange = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === 'All') newParams.delete('material');
    else newParams.set('material', val);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-gray-100 pb-12">
        <div>
          <h1 className="text-5xl font-bold serif text-gray-900 tracking-tighter">Collections</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Refining {filtered.length} designs for you</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none min-w-[240px]">
            <Search className="absolute left-5 top-3.5 text-gray-300" size={16} />
            <input
              type="text"
              placeholder="Search designs..."
              className="bg-gray-50 border border-transparent focus:bg-white focus:border-gold/30 pl-14 pr-6 py-4 text-xs font-bold uppercase tracking-wider rounded-2xl outline-none w-full transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={activeCategory}
            onChange={e => handleCategoryChange(e.target.value)}
            className="bg-white border-2 border-gray-50 px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl outline-none hover:border-gold/30 transition-colors shadow-sm cursor-pointer"
          >
            <option value="All">Categories</option>
            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={activeMaterial}
            onChange={e => handleMaterialChange(e.target.value)}
            className="bg-white border-2 border-gray-50 px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl outline-none hover:border-gold/30 transition-colors shadow-sm cursor-pointer"
          >
            <option value="All">Materials</option>
            {Object.values(Material).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={wishlistIds.has(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-48 bg-gray-50/30 rounded-[3rem] border-2 border-dashed border-gray-100">
          <ShoppingBag size={48} className="mx-auto text-gray-200 mb-8" strokeWidth={1} />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No matches found.</p>
          <button onClick={() => setSearchParams({})} className="mt-6 text-gold font-black uppercase text-[10px] tracking-widest border-b border-gold pb-1 hover:text-maroon hover:border-maroon transition-colors">Clear All Filters</button>
        </div>
      )}
    </div>
  );
};

const ProductDetailPage: React.FC<{
  products: Product[];
  onAddToCart: (p: Product) => void;
}> = ({ products, onAddToCart }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);

  if (!product) return <div className="py-48 text-center font-bold text-2xl serif text-maroon">Design Not Found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid md:grid-cols-2 gap-24">
        <div className="bg-gray-50 p-12 rounded-[3rem] relative overflow-hidden group">
          <img src={product.image} className="w-full h-auto rounded-[2rem] shadow-2xl transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
          {product.isBogo && (
            <div className="absolute top-16 left-16 bg-pink-500 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">Bestseller</div>
          )}
        </div>
        <div className="flex flex-col space-y-12 py-6">
          <div>
            <div className="flex items-center text-[10px] font-black text-gold mb-6 uppercase tracking-[0.4em]">
              <Star size={14} className="fill-gold mr-3" /> Handcrafted Original
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter serif text-gray-900 leading-[1.1]">{product.name}</h1>
            <div className="flex gap-6">
              <span className="bg-gray-50 text-gray-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">{product.material}</span>
              <span className="bg-gray-50 text-gray-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">{product.weight} Grams</span>
            </div>
          </div>

          <div className="flex items-baseline space-x-10">
            <span className="text-6xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-2xl text-gray-300 line-through">₹{(product.price * 1.6).toLocaleString()}</span>
            <span className="text-green-600 font-black text-xs uppercase tracking-widest">33% Discount Applied</span>
          </div>

          <p className="text-gray-500 leading-relaxed font-medium text-lg border-l-2 border-gold/40 pl-8">
            {product.description || `Exquisite handcrafted piece, perfect for daily wear or festive occasions. Skin-friendly and durable design inspired by South Indian traditions.`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-6 bg-black text-white font-black rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:bg-gray-900 transition-all uppercase tracking-widest text-[10px]"
            >
              Add to Bag
            </button>
            <button
              onClick={() => window.open(`https://wa.me/${SHOP_INFO.whatsapp}?text=Hi, I am interested in ${product.name}`, '_blank')}
              className="w-full py-6 border-2 border-green-500 text-green-600 font-black rounded-3xl flex items-center justify-center uppercase tracking-widest text-[10px] hover:bg-green-50 transition-all"
            >
              <MessageCircle size={20} className="mr-3" /> WhatsApp Buy
            </button>
          </div>

          <div className="border-t border-gray-100 pt-16">
            <h4 className="font-black text-[10px] uppercase tracking-[0.5em] text-gray-300 mb-12">Caring for your jewellery</h4>
            <div className="grid grid-cols-2 gap-12">
              {CARE_TIPS.map((tip, i) => (
                <div key={i} className="group">
                  <p className="font-black text-[10px] uppercase text-gray-900 mb-4 underline underline-offset-8 decoration-gold/20 group-hover:decoration-gold transition-all">{tip.titleEn}</p>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">{tip.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage: React.FC<{
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}> = ({ cart, onRemove, onUpdateQty }) => {
  const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
  if (cart.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-56 text-center">
      <ShoppingBag size={100} className="mx-auto text-gray-100 mb-10" strokeWidth={1} />
      <h2 className="text-5xl font-bold mb-10 serif text-gray-900">Bag is Empty</h2>
      <Link to="/catalog" className="inline-block bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl">Back to Collections</Link>
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-20 serif text-gray-900 tracking-tight">Shopping Bag ({cart.length})</h1>
      <div className="space-y-16 border-b border-gray-50 pb-24">
        {cart.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-12 items-center group">
            <img src={item.image} className="w-40 h-40 object-cover rounded-[2rem] shadow-xl group-hover:scale-105 transition-transform duration-500" alt={item.name} />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4 gap-6">
                <h3 className="font-bold text-2xl text-gray-900 leading-tight">{item.name}</h3>
                <button onClick={() => onRemove(item.id)} className="p-4 bg-gray-50 text-gray-300 hover:text-red-500 rounded-full transition-colors"><Trash2 size={20} /></button>
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-8">{item.material} • ₹{item.price.toLocaleString()}</p>
              <div className="flex items-center justify-center sm:justify-start space-x-12 mt-8">
                <div className="flex items-center border border-gray-100 rounded-full px-8 py-3 bg-white shadow-sm">
                  <button onClick={() => onUpdateQty(item.id, -1)} className="text-gray-400 hover:text-black transition-colors"><Minus size={16} /></button>
                  <span className="mx-12 text-lg font-black text-gray-900">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.id, 1)} className="text-gray-400 hover:text-black transition-colors"><Plus size={16} /></button>
                </div>
                <span className="font-black text-3xl text-gray-900 ml-auto">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-24 p-16 rounded-[4rem] bg-gray-50 relative overflow-hidden border border-gray-100">
        <div className="relative z-10">
          <div className="flex justify-between items-center text-3xl font-bold mb-16 text-gray-900">
            <span className="serif italic">Bag Total</span>
            <span className="text-maroon text-5xl font-black tracking-tighter">₹{total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => window.open(`https://wa.me/${SHOP_INFO.whatsapp}?text=I want to order: ${cart.map(i => `${i.name} (Qty: ${i.quantity})`).join(', ')}. Total: ₹${total.toLocaleString()}`, '_blank')}
            className="w-full py-8 bg-black text-white font-black rounded-full shadow-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-maroon hover:scale-[1.02] transition-all"
          >
            Confirm Order via WhatsApp
          </button>
          <p className="text-center text-gray-300 text-[9px] font-black uppercase tracking-[0.5em] mt-10">Handcrafted Excellence Since 2012</p>
        </div>
      </div>
    </div>
  );
};

const WishlistPage: React.FC<{
  wishlist: Product[];
  onRemove: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}> = ({ wishlist, onRemove, onAddToCart }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-24 serif text-gray-900 tracking-tight">Wishlist ({wishlist.length})</h1>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
          {wishlist.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onToggleWishlist={onRemove} isInWishlist={true} />)}
        </div>
      ) : (
        <div className="text-center py-48 bg-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-100">
          <Heart size={80} className="mx-auto text-gray-100 mb-10" strokeWidth={1} />
          <div className="text-gray-300 italic font-bold text-xl uppercase tracking-widest">No favorites yet.</div>
          <Link to="/catalog" className="mt-12 inline-block text-gold font-black uppercase text-[10px] tracking-[0.3em] border-b-2 border-gold pb-1">Discover Designs</Link>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vanitha_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vanitha_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vanitha_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('vanitha_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('vanitha_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('vanitha_wishlist', JSON.stringify(wishlist)), [wishlist]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => prev.find(i => i.id === product.id) ? prev.filter(i => i.id !== product.id) : [...prev, product]);
  };
  const wishlistIds = useMemo(() => new Set(wishlist.map(i => i.id)), [wishlist]);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar cartCount={cart.reduce((a, b) => a + b.quantity, 0)} wishlistCount={wishlist.length} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage products={products} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlistIds={wishlistIds} />} />
            <Route path="/catalog" element={<CatalogPage products={products} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlistIds={wishlistIds} />} />
            <Route path="/rentals" element={<CatalogPage products={products.filter(p => p.category === Category.RENTAL)} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlistIds={wishlistIds} />} />
            <Route path="/product/:id" element={<ProductDetailPage products={products} onAddToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} onRemove={removeFromCart} onUpdateQty={updateCartQty} />} />
            <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} onRemove={toggleWishlist} onAddToCart={addToCart} />} />
            <Route path="/admin" element={<AdminDashboard products={products} onAddProduct={p => setProducts([p, ...products])} onDeleteProduct={id => setProducts(products.filter(p => p.id !== id))} onUpdateProduct={p => setProducts(products.map(o => o.id === p.id ? p : o))} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
