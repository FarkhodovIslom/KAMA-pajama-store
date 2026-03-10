
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductPlaceholder } from '../../data/mockData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFan, faWater, faChild } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../lib/api';

export function ImageGallery({ product, images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const placeholder = getProductPlaceholder(product);
  const displayImages = images.length > 0 ? images : [placeholder];
  
  const scrollPrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };
  
  const scrollNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square bg-surface rounded-card overflow-hidden shadow-soft">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center text-8xl"
            style={{ backgroundColor: !displayImages[selectedIndex]?.startsWith('/uploads') ? displayImages[selectedIndex] : undefined }}
          >
            {displayImages[selectedIndex]?.startsWith('/uploads') ? (
              <img 
                src={`${BASE_URL}${displayImages[selectedIndex]}`}
                alt={`${product.name} - ${selectedIndex + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {product.category === 'Женские' && <FontAwesomeIcon icon={faFan} />}
                {product.category === 'Мужские' && <FontAwesomeIcon icon={faWater} />}
                {product.category === 'Детские' && <FontAwesomeIcon icon={faChild} />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                selectedIndex === index
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ backgroundColor: !img?.startsWith('/uploads') ? img : undefined }}
            >
              {img?.startsWith('/uploads') ? (
                <img 
                  src={`${BASE_URL}${img}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-2xl">
                  {product.category === 'Женские' && <FontAwesomeIcon icon={faFan} />}
                  {product.category === 'Мужские' && <FontAwesomeIcon icon={faWater} />}
                  {product.category === 'Детские' && <FontAwesomeIcon icon={faChild} />}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
