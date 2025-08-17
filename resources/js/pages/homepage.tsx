import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';

type CategoryItem = { id_category: number; category_name: string; image: string };
type ProductItem = { id_product: number; name: string; price: number; originalPrice: number; discount: number; image: string };

type HomepageProps = {
    user: { name: string } | null;
    products: ProductItem[];
    categories: CategoryItem[];
};

export default function Homepage({ user, products, categories }: HomepageProps) {
    const cartCount = usePage().props.cartCount as number;

    const formatPrice = (price: number | string): string => {
        const numPrice = typeof price === 'string' ? Number(price) : price;

        if (isNaN(numPrice)) {
            return 'Rp. -';
        }

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        })
            .format(numPrice)
            .replace('Rp', 'Rp. ');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="PhoneStore - Belanja Gadget Terbaik" />

            {/* Header */}
            <Header user={user} cartItemCount={cartCount} />

            {/* Hero Banner */}
            <section className="relative aspect-[16/6] w-full overflow-hidden bg-gray-200">
                <img
                    src="/images/rectangle_5.png"
                    alt="Promo Spesial"
                    className="h-full w-full object-fill object-center"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto px-4 py-8 md:px-6">
                <h2 className="mb-4 text-xl font-bold text-gray-800 md:text-2xl">Kategori Populer</h2>
                <div className="relative">
                    <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id_category}
                                href={route('categories.user.index', { id: category.id_category })}
                                className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-50">
                                    <img
                                        src={category.image.startsWith('http') ? category.image : `/storage/${category.image}`}
                                        alt={category.category_name}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="mt-5 text-center text-sm font-medium text-gray-800">{category.category_name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="container mx-auto px-4 pb-12 md:px-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                        Pilihan terbaik untuk <span className="text-blue-600">Smartphone</span>
                    </h2>
                    <Button variant="link" className="text-blue-600 hover:underline" asChild>
                        <Link href="/products">Lihat Semua</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {products.map((product) => {
                        return (
                            <Link
                                key={product.id_product}
                                href={route('products.show.details', { id: product.id_product })}
                                className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {product.discount > 0 && (
                                        <span className="absolute top-2 left-2 rounded bg-yellow-400 px-2 py-1 text-xs font-bold">
                                            {product.discount}% off
                                        </span>
                                    )}
                                </div>

                                <div className="p-3">
                                    <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-gray-800">{product.name}</h3>
                                    <div className="mt-2">
                                        <p className="font-bold text-blue-600">{formatPrice(product.price)}</p>
                                        <p className="hidden text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
            <Footer />
        </div>
    );
}
