import { useState, useEffect } from 'react';
import { Menu, X, Phone, Instagram, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { SiteContent } from '../types';
import Logo from './Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '#collections' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-maroon-950/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Logo />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-stone-100 hover:text-gold-400 transition-colors uppercase tracking-widest"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center space-x-4 ml-4 border-l border-white/20 pl-6">
              <a href="https://www.instagram.com/vanitha52517" target="_blank" rel="noreferrer" className="text-stone-100 hover:text-gold-400 transition-colors">
                <Instagram size={20} />
              </a>
              <Link to="/login" className="text-stone-100 hover:text-gold-400 transition-colors" title="Admin Login">
                <Lock size={18} />
              </Link>
              <a href="tel:9080509976" className="flex items-center space-x-2 bg-gold-600 hover:bg-gold-500 text-maroon-950 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg">
                <Phone size={16} />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/login" className="text-gold-400 p-2" title="Admin Login">
              <Lock size={20} />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gold-400 p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-maroon-950 border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-stone-100 hover:bg-maroon-900 hover:text-gold-400 rounded-lg transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex items-center justify-between px-3">
                <div className="flex items-center space-x-6">
                  <a href="https://www.instagram.com/vanitha52517" target="_blank" rel="noreferrer" className="text-stone-100">
                    <Instagram size={24} />
                  </a>
                  <Link to="/login" className="text-stone-100" onClick={() => setIsMobileMenuOpen(false)}>
                    <Lock size={22} />
                  </Link>
                </div>
                <a href="tel:9080509976" className="flex items-center space-x-2 bg-gold-600 text-maroon-950 px-6 py-3 rounded-lg font-bold">
                  <Phone size={18} />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

  );
}
