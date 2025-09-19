import { Link } from '@inertiajs/react';

type ProductItem = {
    id_product: number;
    name: string;
    price: number;
    image: string;
    soldCount?: number; // jumlah terjual dari invoice
    category: {
        id_category: number;
        category_name: string;
    };
};

type Props = {
    product: ProductItem;
    formatPrice: (price: number | string) => string;
};

export default function ProductCard({ product, formatPrice }: Props) {
    return (
        <div className="relative h-fit w-fit rounded-lg border-1 border-grey2 bg-white">
            <div>
                <Link
                    href={route('products.show.details', { id: product.id_product })}
                    className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
                >
                    {/* Gambar produk */}
                    <div className="rounded-t-md bg-grey5 p-2 shadow-md">
                        <div className="mt-3 h-[100px] w-[95px] md:h-[110px] md:w-[120px] lg:h-[140px] lg:w-[150px]">
                            <img
                                src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Info produk */}
                    <div className="flex h-full w-full justify-start object-contain align-middle lg:px-1 lg:py-3">
                        <div className="p-2">
                            <h3 className="line-clamp-2 text-sm leading-tight font-black text-black lg:text-[15px]">{product.name}</h3>
                            <div className="mt-2">
                                <p className="font-semibold text-blue-600">{formatPrice(product.price)}</p>
                                {product.soldCount !== undefined && <span className="text-xs text-gray-500">{product.soldCount} Terjual</span>}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
