import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const filters = {
    harga: ['Harga Tertinggi', 'Harga Terendah'],
    brand: ['Apple', 'Samsung', 'Vivo', 'Oppo', 'Xiaomi', 'Infinix', 'Realme', 'Motorola'],
};

type Product = {
    id_product: number;
    name: string;
    price: string;
    image: string;
    merk?: { name: string };
    category?: { name: string };
};

type PageProps = {
    user: { name: string } | null;
    products: Product[];
    categoryId: number;
    cartCount: number;
};

export default function SmartphonePage({ user, products, cartCount }: PageProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [openSections, setOpenSections] = useState({
        harga: false,
        brand: false
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <>
            {/* Header */}
            <Header user={user} cartItemCount={cartCount} />

            <div className="container mx-auto px-4 py-6">
                {/* Mobile Filter Toggle */}
                <div className="mb-4 flex md:hidden">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                        <FiFilter size={18} />
                        <span>Filter</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* Sidebar Filter */}
                    <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:col-span-3 md:block`}>
                        <div className="relative rounded-2xl border bg-white p-4 shadow-sm">
                            {/* Close Button for Mobile */}
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="absolute right-3 top-3 md:hidden"
                            >
                                <FiX size={20} />
                            </button>

                            <h2 className="mb-4 text-lg font-bold">Filter Produk</h2>

                            {/* Filter Harga */}
                            <div className="mb-6">
                                <button
                                    className="flex w-full items-center justify-between py-2 font-semibold"
                                    onClick={() => toggleSection('harga')}
                                >
                                    <span>Harga</span>
                                    {openSections.harga ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                                {openSections.harga && (
                                    <div className="mt-2 pl-2">
                                        {filters.harga.map((item) => (
                                            <label key={`harga-${item}`} className="flex items-center space-x-2 py-1">
                                                <Checkbox
                                                    id={`harga-${item}`}
                                                    value={item}
                                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                                />
                                                <span className="text-sm">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Filter Brand */}
                            <div>
                                <button
                                    className="flex w-full items-center justify-between py-2 font-semibold"
                                    onClick={() => toggleSection('brand')}
                                >
                                    <span>Brand</span>
                                    {openSections.brand ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                                {openSections.brand && (
                                    <div className="mt-2 grid grid-cols-1 gap-2 pl-2">
                                        {filters.brand.map((item) => (
                                            <label key={`brand-${item}`} className="flex items-center space-x-2 py-1">
                                                <Checkbox
                                                    id={`brand-${item}`}
                                                    value={item}
                                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                                />
                                                <span className="text-sm">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Produk Grid */}
                    <main className="md:col-span-9">
                        {/* Results Count */}
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Menampilkan {products.length} produk
                            </p>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <Card key={product.id_product} className="overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md">
                                        <Link href={route('products.show.details', { id: product.id_product })}>
                                            {/* Bagian Gambar */}
                                            <div className="h-48 w-full overflow-hidden sm:h-52">
                                                <img
                                                    src={
                                                        product.image?.startsWith('http')
                                                            ? product.image
                                                            : product.image
                                                                ? `/storage/${product.image}`
                                                                : '/placeholder.png'
                                                    }
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </div>

                                            {/* Bagian Info Produk */}
                                            <CardContent className="p-3 sm:p-4">
                                                <h4 className="line-clamp-2 text-sm font-medium text-gray-900 sm:text-base">
                                                    {product.name}
                                                </h4>
                                                <p className="mt-2 text-base font-semibold text-blue-600 sm:text-lg">
                                                    Rp{' '}
                                                    {Number(product.price).toLocaleString('id-ID', {
                                                        minimumFractionDigits: 0,
                                                    })}
                                                </p>
                                                {product.merk && (
                                                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                                        {product.merk.name}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="rounded-full bg-gray-100 p-4">
                                    <FiX size={32} className="text-gray-400" />
                                </div>
                                <p className="mt-4 text-gray-500">Belum ada produk pada kategori ini.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
}
