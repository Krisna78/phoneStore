import { Link } from '@inertiajs/react';

type ProductItem = {
    id_product: number;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
};

type Props = {
    product: ProductItem;
    formatPrice: (price: number | string) => string;
};

export default function ProductCard({ product, formatPrice }: Props) {
    return (
        <Link
            href={route('products.show.details', { id: product.id_product })}
            className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
        >
            {/* Gambar produk */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                {product.discount > 0 && (
                    <span className="absolute top-2 left-2 rounded bg-yellow-400 px-2 py-1 text-xs font-bold">{product.discount}% off</span>
                )}
            </div>

            {/* Info produk */}
            <div className="p-3">
                <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-gray-800">{product.name}</h3>
                <div className="mt-2">
                    <p className="font-bold text-blue-600">{formatPrice(product.price)}</p>
                    {product.originalPrice > 0 && <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>}
                </div>
            </div>
        </Link>
    );
}
