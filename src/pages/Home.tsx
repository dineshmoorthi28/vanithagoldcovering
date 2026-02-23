import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, Instagram, ArrowRight, Star, CheckCircle2, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';
import api from '../utils/api';
import { Product, Category, SiteContent } from '../types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const SUB_CATEGORIES_MAP: Record<string, string[]> = {
    'Earrings': ['Stud', 'Jhumka', 'Hoop', 'Drop', 'Chandbali'],
    'Necklace': ['Long Chain', 'Short Chain', 'Haram', 'Dollar Chain', 'Pendant Set'],
    'Bridal Sets': ['Full Bridal Combo', 'Temple Bridal Set', 'Antique Bridal Set'],
    'Bangles': [],
    'Rings': []
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, contentRes] = await Promise.all([
          api.get(`/products?t=${Date.now()}`),
          api.get('/categories'),
          api.get('/content')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setContent(contentRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSubCategory = activeSubCategory === 'all' || p.subCategory?.toLowerCase() === activeSubCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  const handleEnquire = (product: Product) => {
    const message = `Hi Vanitha Covering, I am interested in "${product.name}" (Price: ₹${product.price}). Can you provide more details?`;
    window.open(`https://wa.me/9080509976?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-maroon-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={content?.hero_image || "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?q=80&w=1972&auto=format&fit=crop"}
            alt="Hero Background"
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-gold-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm">
              Traditional Excellence
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              {content?.hero_title || 'Premium Traditional Gold Covering Jewellery'}
            </h1>
            <p className="text-lg text-stone-300 mb-10 leading-relaxed font-light">
              {content?.hero_subtitle || 'Experience the elegance of tradition with our exquisite collection of Impon and Panchaloha jewellery.'}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="#collections"
                className="bg-gold-600 hover:bg-gold-500 text-maroon-950 px-8 py-4 rounded-full font-bold text-center transition-all shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>View Collections</span>
                <ArrowRight size={20} />
              </a>
              <a
                href="#contact"
                className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-center transition-all backdrop-blur-sm"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="bg-gold-500 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-8 mx-8">
              <span className="text-maroon-950 font-bold uppercase tracking-widest text-sm">✨ Buy 1 Get 1 Offer on Selected Bangles ✨</span>
              <span className="text-maroon-950 font-bold uppercase tracking-widest text-sm">✨ New Bridal Sets Collection Just Arrived ✨</span>
              <span className="text-maroon-950 font-bold uppercase tracking-widest text-sm">✨ Special Discount for First Time Customers ✨</span>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={content?.about_image || "https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/1e9c5513-4059-42f7-85eb-b07fd8bb8984.jpg"}
                  alt="About Vanitha Covering"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-maroon-900 p-8 rounded-2xl shadow-2xl hidden md:block">
                <div className="text-gold-400 text-4xl font-serif font-bold mb-1">5+</div>
                <div className="text-white text-sm uppercase tracking-widest">Years of Trust</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-maroon-700 font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-8 leading-tight">
                Specialists in Impon & Panchaloha Jewellery
              </h2>
              <p className="text-stone-600 mb-8 leading-relaxed text-lg">
                {content?.about_text || 'Vanitha Covering is a specialist in traditional South Indian jewellery. We specialize in Impon (Five Metals) and Panchaloha jewellery, crafted with precision to give you the authentic gold look at an affordable price.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="text-gold-600 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-stone-900">Authentic Designs</h4>
                    <p className="text-sm text-stone-500">Traditional patterns inspired by temple jewellery.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="text-gold-600 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-stone-900">Premium Quality</h4>
                    <p className="text-sm text-stone-500">Long-lasting gold covering with superior finish.</p>
                  </div>
                </div>
              </div>
              <a href="tel:9080509976" className="inline-flex items-center space-x-3 text-maroon-900 font-bold group">
                <span>Learn more about our process</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-maroon-700 font-bold tracking-widest uppercase text-sm mb-4 block">Our Collections</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">Exquisite Masterpieces</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto" />
          </div>

          {/* Filters & Search */}
          <div className="space-y-8 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => { setActiveCategory('all'); setActiveSubCategory('all'); }}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === 'all' ? 'bg-maroon-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}
                >
                  All Collections
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.name); setActiveSubCategory('all'); }}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat.name ? 'bg-maroon-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="text"
                  placeholder="Search jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-sm border-none focus:ring-2 focus:ring-gold-500 shadow-sm"
                />
              </div>
            </div>

            {/* Sub Category Chips */}
            <AnimatePresence mode="wait">
              {activeCategory !== 'all' && SUB_CATEGORIES_MAP[activeCategory]?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-wrap justify-center gap-3 pt-4 border-t border-stone-200"
                >
                  <button
                    onClick={() => setActiveSubCategory('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeSubCategory === 'all' ? 'bg-gold-600 text-maroon-950' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                  >
                    All {activeCategory}
                  </button>
                  {SUB_CATEGORIES_MAP[activeCategory].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubCategory(sub)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeSubCategory === sub ? 'bg-gold-600 text-maroon-950' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onEnquire={handleEnquire} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-stone-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-maroon-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gold-400 mb-6">Customer Reviews</h2>
            <div className="flex justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} className="fill-gold-500 text-gold-500" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Priya S.', text: 'The quality of the Impon necklace I bought is amazing. It looks exactly like real gold. Highly recommended!', role: 'Bridal Customer' },
              { name: 'Anitha R.', text: 'Best place in Aranthangi for traditional jewellery. The collection is huge and prices are very reasonable.', role: 'Regular Customer' },
              { name: 'Meena K.', text: 'Bought bangles for my sister\'s wedding. Everyone thought they were real gold. Excellent craftsmanship.', role: 'Wedding Shopper' }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10"
              >
                <p className="text-stone-300 italic mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gold-600 flex items-center justify-center text-maroon-950 font-bold text-xl">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gold-400">{review.name}</h4>
                    <p className="text-xs text-stone-500 uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="text-maroon-700 font-bold tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
              <h2 className="text-4xl font-serif font-bold text-stone-900 mb-8">Visit Our Store</h2>
              <div className="space-y-8 mb-12">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">Our Location</h4>
                    <p className="text-stone-600">{content?.contact_address || 'Near Bus Stand, Gandhi Poonga Road, Aranthangi – 614616'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">Call Us</h4>
                    <p className="text-stone-600">{content?.contact_phone || '9080509976'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">Instagram</h4>
                    <a href={content?.instagram_url} target="_blank" rel="noreferrer" className="text-maroon-700 hover:underline">@vanitha52517</a>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" className="w-full px-6 py-4 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-gold-500" />
                  <input type="text" placeholder="Phone Number" className="w-full px-6 py-4 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-gold-500" />
                </div>
                <textarea placeholder="Your Message" rows={4} className="w-full px-6 py-4 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-gold-500"></textarea>
                <button className="w-full bg-maroon-900 text-white py-4 rounded-xl font-bold hover:bg-maroon-800 transition-all shadow-lg">
                  Send Enquiry
                </button>
              </form>
            </div>

            <div className="h-[500px] lg:h-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.753443105432!2d78.9954!3d10.1645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00676767676767%3A0x6767676767676767!2sAranthangi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1676767676767!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
