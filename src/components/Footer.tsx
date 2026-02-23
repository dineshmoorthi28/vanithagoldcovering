import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-maroon-950 text-stone-200 pt-16 pb-8 border-t border-gold-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <a href="/" className="flex flex-col mb-6">
              <Logo
                textClassName="text-3xl font-serif font-bold tracking-wider text-gold-400"
                subTextClassName="text-xs font-sans tracking-[0.2em] text-gold-200/80 uppercase -mt-1"
              />
            </a>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              Premium Traditional South Indian Gold Covering Jewellery. Specializing in Impon and Panchaloha collections for every occasion.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/vanitha52517" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-maroon-900 flex items-center justify-center text-gold-400 hover:bg-gold-600 hover:text-maroon-950 transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-maroon-900 flex items-center justify-center text-gold-400 hover:bg-gold-600 hover:text-maroon-950 transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-400 font-serif text-xl mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition-colors">Home</a></li>
              <li><a href="#collections" className="hover:text-gold-400 transition-colors">Collections</a></li>
              <li><a href="#about" className="hover:text-gold-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-gold-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-gold-400 font-serif text-xl mb-6">Collections</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#collections" className="hover:text-gold-400 transition-colors">Necklaces</a></li>
              <li><a href="#collections" className="hover:text-gold-400 transition-colors">Bangles</a></li>
              <li><a href="#collections" className="hover:text-gold-400 transition-colors">Earrings</a></li>
              <li><a href="#collections" className="hover:text-gold-400 transition-colors">Bridal Sets</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gold-400 font-serif text-xl mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-gold-500 shrink-0 mt-0.5" />
                <span className="text-stone-400">Near Bus Stand, Gandhi Poonga Road, Aranthangi – 614616</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-gold-500 shrink-0" />
                <a href="tel:9080509976" className="text-stone-400 hover:text-gold-400">9080509976</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-gold-500 shrink-0" />
                <a href="mailto:mrtamilp@gmail.com" className="text-stone-400 hover:text-gold-400">mrtamilp@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-stone-500 text-xs">
          <p>© {new Date().getFullYear()} Vanitha Covering Jewellery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
