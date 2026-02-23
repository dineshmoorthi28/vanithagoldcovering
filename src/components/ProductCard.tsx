import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onEnquire: (product: Product) => void;
}

export default function ProductCard({ product, onEnquire }: ProductCardProps) {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          crossOrigin="anonymous"
          onError={(e) => console.error(`Failed to load image: ${product.image}`, e)}
        />

        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-maroon-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {discount}% OFF
          </div>
        )}

        {product.status === 'Featured' && (
          <div className="absolute top-4 right-4 bg-gold-500 text-maroon-950 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
            Featured
          </div>
        )}

        <div className="absolute inset-0 bg-maroon-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <button
            onClick={() => onEnquire(product)}
            className="bg-gold-500 text-maroon-950 p-3 rounded-full hover:bg-gold-400 transition-colors shadow-lg"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="text-[10px] text-gold-600 font-bold uppercase tracking-widest mb-1">
          {product.category}
        </div>
        <h3 className="text-lg font-serif font-bold text-stone-900 mb-2 group-hover:text-maroon-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold text-maroon-900">₹{product.price}</span>
          {product.oldPrice > product.price && (
            <span className="text-sm text-stone-400 line-through">₹{product.oldPrice}</span>
          )}
        </div>
        <button
          onClick={() => onEnquire(product)}
          className="w-full mt-4 py-2.5 border border-maroon-900 text-maroon-900 rounded-lg text-sm font-bold hover:bg-maroon-900 hover:text-white transition-all duration-300"
        >
          Enquire Now
        </button>
      </div>
    </motion.div>
  );
}
