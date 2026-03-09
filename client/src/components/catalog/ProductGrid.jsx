
import { ProductCard } from './ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';

export function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-6xl mb-4"><FontAwesomeIcon icon={faFaceFrown} /></span>
        <p className="text-text-muted text-lg font-semibold">
          Товары не найдены
        </p>
        <p className="text-text-muted text-sm mt-1">
          Попробуйте изменить фильтры
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
