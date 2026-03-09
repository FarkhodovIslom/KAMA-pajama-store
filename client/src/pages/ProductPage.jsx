
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ImageGallery } from '../components/product/ImageGallery';
import { SizeSelector } from '../components/product/SizeSelector';
import { ColorSelector } from '../components/product/ColorSelector';
import { ProductCard } from '../components/catalog/ProductCard';
import { Button } from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/utils';
import { api } from '../lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);
  
  useEffect(() => {
    let active = true;
    
    const fetchProductData = async () => {
      setLoading(true);
      setError(false);
      try {
        const prodData = await api.get(`/api/products/${id}`);
        if (!active) return;
        
        // Map backend fields to frontend props
        const mappedProduct = {
          ...prodData,
          category: prodData.category_name, // Map for UI display
          inStock: prodData.in_stock,
        };
        
        setProduct(mappedProduct);
        
        // Default variant selections
        const availableVars = mappedProduct.variants?.filter(v => v.stockQty > 0) || [];
        if (availableVars.length > 0) {
          setSelectedSize(availableVars[0].size);
          setSelectedColor(availableVars[0].color);
        }

        // Fetch similar products
        if (prodData.category_id) {
          // get slug if we can, or just use category ID in a real app,
          // but our backend takes slug for filtering.
          // Since we don't have the slug directly on the product response easily,
          // let's fetch without category filter but limit to 4 for now, 
          // or just fetch all and slice if we want it to work out of box.
          const similarResponse = await api.get(`/api/products?limit=5`);
          if (active) {
            const mappedSimilar = (similarResponse.products || [])
              .filter(p => p.id !== Number(id))
              .map(p => ({
                ...p,
                category: p.category_name,
                inStock: p.in_stock,
                image: p.images && p.images.length > 0 ? p.images[0] : null
              }))
              .slice(0, 4);
            setSimilarProducts(mappedSimilar);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    fetchProductData();
    
    return () => { active = false; };
  }, [id]);
  
  const currentVariant = product?.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor?.trim()
  );
  
  const handleAddToCart = () => {
    if (!product || !currentVariant) return;
    
    addItem(product, currentVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-surface/50 w-24 rounded"></div>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="aspect-[3/4] bg-surface/50 rounded-card"></div>
              <div className="space-y-4">
                <div className="h-10 bg-surface/50 w-3/4 rounded"></div>
                <div className="h-8 bg-surface/50 w-1/4 rounded"></div>
                <div className="h-32 bg-surface/50 w-full rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4"><FontAwesomeIcon icon={faFaceFrown} /></p>
            <p className="text-text-muted">Товар не найден</p>
            <Link to="/" className="text-primary-dark hover:underline mt-4 inline-block">
              Вернуться в каталог
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6"
        >
          <ArrowLeft size={18} />
          Назад
        </button>
        
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ImageGallery product={product} images={product.images || []} />
          </motion.div>
          
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-text-muted font-semibold">{product.category}</p>
              <h1 className="font-borel text-3xl mt-1">{product.name}</h1>
            </div>
            
            <p className="text-3xl font-extrabold text-primary-dark">
              {formatPrice(product.price)}
            </p>
            
            <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
            
            {/* Selectors */}
            {product.variants?.length > 0 && (
              <div className="space-y-4 pt-4">
                <SizeSelector
                  variants={product.variants}
                  selectedSize={selectedSize}
                  onSelect={setSelectedSize}
                />
                
                {product.variants.length > 1 && product.variants.some(v => v.color.trim() !== product.variants[0]?.color) && (
                  <ColorSelector
                    variants={product.variants}
                    selectedColor={selectedColor}
                    onSelect={setSelectedColor}
                  />
                )}
              </div>
            )}
            
            {/* Add to cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || !currentVariant}
                className="w-full"
                size="lg"
              >
                {added ? (
                  <>
                    <Check size={20} className="mr-2" />
                    Добавлено!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} className="mr-2" />
                    {product.inStock ? 'В корзину' : 'Нет в наличии'}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Similar products */}
        {similarProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="font-borel text-2xl mb-6">Похожие товары</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {similarProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
