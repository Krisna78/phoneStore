import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type DetailProductProps = {
    user: User | null;
    product: Product;
};
interface User {
    id: number;
    name: string;
    email: string;
}
type Product = {
    id_product: string;
    name: string;
    price: number | string;
    oldPrice?: number | string;
    description: string;
    image: string; // Hanya satu gambar
    sold?: number;
    specs?: { label: string; value: string }[];
};
interface XenditInvoiceResponse {
    id: string;
    external_id: string;
    amount: number;
    status: string;
    invoice_url: string;
    description: string;
}

const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? Number(price) : price;
    if (isNaN(numPrice)) return 'Rp. -';

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
        .format(numPrice)
        .replace('Rp', 'Rp.');
};

export default function DetailProduct({ user, product }: DetailProductProps) {
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const cartCount = usePage().props.cartCount as number;

    if (!product) return <div>Loading...</div>;

    const handleBuyNow = () => {
        if (!user) {
            router.visit(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        setIsProcessing(true);
        const timeout = setTimeout(() => {
            setIsProcessing(false);
            toast({
                title: 'Timeout',
                description: 'Koneksi ke Xendit terlalu lama. Silakan coba lagi.',
                variant: 'destructive',
            });
        }, 15000);

        router.post(
            route('invoice.createPay'),
            {
                description: product.name,
                amount: product.price,
                payer_email: user.email,
                product_id: product.id_product,
                quantity: 1,
                price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                user_id: user.id,
            },
            {
                onSuccess: (page) => {
                    clearTimeout(timeout);
                    setIsProcessing(false);
                    const result = (page.props as unknown as { result: XenditInvoiceResponse }).result;
                    if (result?.invoice_url) {
                        window.location.href = result.invoice_url;
                    } else {
                        toast.error('Koneksi ke Xendit terlalu lama. Silakan coba lagi.', {
                            description: 'Timeout setelah 15 detik',
                            duration: 5000,
                        });
                    }
                },
                onError: () => {
                    clearTimeout(timeout);
                    setIsProcessing(false);
                    toast.error('Terjadi kesalahan saat membuat invoice.', {
                        description: 'Error',
                        duration: 5000,
                    });
                },
            },
        );
    };

    const handleAddToCart = () => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.product.id_product === product.id_product);
            if (existingIndex !== -1) return prevCart;
            return [...prevCart, { product, quantity: 1 }];
        });
        router.post('/cart/add', {
            product_id: product.id_product,
            quantity: 1,
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title={product.name} />
            <Header user={user} cartItemCount={cartCount} />

            <main className="mx-auto max-w-7xl px-4 py-6">
                {/* Breadcrumb */}
                <div className="mb-4 flex items-center gap-1 text-sm">
                    <a href="/" className="text-gray-500 hover:text-blue-600">
                        Home
                    </a>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                    <a href="/smartphone" className="text-gray-500 hover:text-blue-600">
                        Smartphone
                    </a>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-700">{product.name}</span>
                </div>

                {/* Product Section */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Left: Image */}
                    <div>
                        <img
                            src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`}
                            alt={product.name}
                            className="max-h-[500px] w-full max-w-md rounded-lg border object-cover"
                        />
                    </div>

                    {/* Right: Info */}
                    <div>
                        <h1 className="text-2xl font-semibold">{product.name}</h1>
                        <p className="text-sm text-gray-500">{product.sold ?? 0} Terjual</p>

                        <div className="mt-3">
                            <p className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</p>
                            {product.oldPrice && <p className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</p>}
                        </div>

                        <div className="mt-6 flex gap-4">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleBuyNow}>
                                Beli Sekarang
                            </Button>
                            <Button size="lg" variant="outline" onClick={handleAddToCart}>
                                Tambah Keranjang
                            </Button>
                        </div>

                        {/* Garansi */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Layanan Resmi dapat dilakukan di seluruh Apple Authorized Service Center di Indonesia
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Garansi 1 Tahun dari Apple Store / Digimap
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deskripsi */}
                <div className="mt-10">
                    <h2 className="mb-4 text-xl font-semibold text-blue-600">Deskripsi Produk</h2>
                    <p className="leading-relaxed text-gray-700">{product.description}</p>
                </div>

                {/* Spesifikasi */}
                {product.specs && (
                    <div className="mt-8">
                        <h3 className="mb-4 text-lg font-semibold text-blue-600">Spesifikasi Produk</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {product.specs.map((spec, idx) => (
                                <div key={idx} className="flex">
                                    <span className="w-32 font-semibold">{spec.label}</span>
                                    <span>{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
