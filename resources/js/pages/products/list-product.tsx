import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from '@inertiajs/react';

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
    return (
        <>
            {/* Header */}
            <Header user={user} cartItemCount={cartCount} />

            <div className="container mx-auto grid grid-cols-12 gap-6 py-6">
                {/* Sidebar Filter */}
                <aside className="col-span-12 md:col-span-3">
                    <div className="space-y-6 rounded-2xl border p-4 shadow-sm">
                        {/* Filter Harga */}
                        <div>
                            <h3 className="mb-2 font-semibold">Harga</h3>
                            {filters.harga.map((item) => (
                                <label key={`harga-${item}`} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`harga-${item}`}
                                        value={item}
                                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                    />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>

                        {/* Filter Brand */}
                        <div>
                            <h3 className="mb-2 font-semibold">Brand</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {filters.brand.map((item) => (
                                    <label key={`brand-${item}`} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`brand-${item}`}
                                            value={item}
                                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Produk Grid */}
                <main className="col-span-full md:col-span-9">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => (
                                <Card key={product.id_product} className="overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-md">
                                    <Link href={route('products.show.details', { id: product.id_product })}>
                                    {/* Bagian Gambar */}
                                    <div className="h-52 w-full overflow-hidden">
                                        <img
                                            src={
                                                product.image?.startsWith('http') ? product.image : product.image ? `/storage/${product.image}`: '/placeholder.png'
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Bagian Info Produk */}
                                    <CardContent className="p-4">
                                        <h4 className="truncate text-base font-medium text-gray-900">{product.name}</h4>
                                        <p className="mt-1 text-lg font-semibold text-blue-600">
                                            Rp{' '}
                                            {Number(product.price).toLocaleString('id-ID', {
                                                minimumFractionDigits: 0,
                                            })}
                                        </p>
                                    </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Belum ada produk pada kategori ini.</p>
                    )}
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
}
