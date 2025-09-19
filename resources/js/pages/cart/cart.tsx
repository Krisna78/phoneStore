import Footer from '@/components/Footer';
import Header2 from '@/components/Header2';
import { Button } from '@/components/ui/button';
import { Head, router, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id_product: number;
    name: string;
    image: string;
    price: number;
    description: string;
}

interface CartItem {
    id_cart_item: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
    product: Product;
}

interface Cart {
    id_cart: number;
    user_id: string;
    created_at: string;
    updated_at: string;
    cart_items: CartItem[];
}

interface CartPageProps {
    user: User;
    cart: Cart;
}
interface XenditInvoiceResponse {
    id: string;
    external_id: string;
    amount: number;
    status: string;
    invoice_url: string;
    description: string;
}

export default function CartPage({ user, cart }: CartPageProps) {
    const items = cart.cart_items ?? [];
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const cartCount = usePage().props.cartCount as number;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const toggleItem = (itemId: number) => {
        setCheckedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
    };

    const toggleAll = () => {
        if (checkedItems.length === items.length) setCheckedItems([]);
        else setCheckedItems(items.map((item) => item.id_cart_item));
    };

    const handleIncrease = (itemId: number, currentQty: number) => {
        router.post(route('carts.update', { id: itemId }), {
            quantity: currentQty + 1,
        });
    };

    const handleDecrease = (itemId: number, currentQty: number) => {
        if (currentQty > 1) {
            router.post(route('carts.update', { id: itemId }), {
                quantity: currentQty - 1,
            });
        }
    };

    const handleDelete = (itemId: number) => {
        if (confirm('Yakin ingin menghapus item ini?')) {
            router.delete(route('carts.destroy', { id: itemId }));
        }
    };

    const discountPercent = 0;
    const selectedItems = items.filter((item) => checkedItems.includes(item.id_cart_item));
    const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = subtotal * discountPercent;
    const totalAfterDiscount = subtotal - discountAmount;

    const handleCheckout = () => {
        if (selectedItems.length === 0) return alert('Pilih minimal 1 item');
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
            route('invoice.create'),
            {
                description: selectedItems.map((item) => `${item.product.name} x${item.quantity}`).join(', '),
                amount: totalAfterDiscount,
                payer_email: user.email,
                id_cart_item: selectedItems.map((item) => item.id_cart_item),
                items: selectedItems.map((item) => ({
                    product_id: item.product.id_product,
                    quantity: item.quantity,
                    line_total: item.quantity * item.product.price,
                })),
            },
            {
                onSuccess: (page) => {
                    const result = (page.props as unknown as { result: XenditInvoiceResponse }).result;
                    if (result?.invoice_url) {
                        window.location.href = result.invoice_url;
                    } else {
                        alert('Gagal membuat invoice. Silakan coba lagi.');
                    }
                },
                onError: (err) => {
                    clearTimeout(timeout);
                    setIsProcessing(false);
                    toast({
                        title: 'Error',
                        description: 'Terjadi kesalahan saat membuat invoice.',
                        variant: 'destructive',
                    });
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title="Keranjang" />
            <Header2 user={user} cartItemCount={cartCount} />

            <main className="mx-auto max-w-6xl px-4 py-6">
                <h1 className="mb-6 text-2xl font-bold">Keranjang Belanja</h1>

                {items.length === 0 ? (
                    <p>Keranjang kosong.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full table-auto border-collapse text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left">
                                            <input
                                                type="checkbox"
                                                className="scale-150 transform"
                                                checked={checkedItems.length === items.length}
                                                onChange={toggleAll}
                                            />
                                        </th>
                                        <th className="p-3 text-left">Produk</th>
                                        <th className="p-3 text-left">Harga</th>
                                        <th className="p-3 text-center">Jumlah</th>
                                        <th className="p-3 text-right">Subtotal</th>
                                        <th className="p-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id_cart_item} className="border-t border-gray-200 hover:bg-gray-50">
                                            <td className="p-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="scale-150 transform"
                                                    checked={checkedItems.includes(item.id_cart_item)}
                                                    onChange={() => toggleItem(item.id_cart_item)}
                                                />
                                            </td>
                                            <td className="flex items-center gap-4 p-3">
                                                <img
                                                    src={
                                                        item.product.image.startsWith('http') ? item.product.image : `/storage/${item.product.image}`
                                                    }
                                                    alt={item.product.name}
                                                    className="h-16 w-16 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold">{item.product.name}</p>
                                                    {item.price < Number(item.product.price) && (
                                                        <p className="text-xs text-gray-400 line-through">
                                                            {formatPrice(Number(item.product.price))}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 font-semibold text-blue-600">{formatPrice(item.price)}</td>
                                            <td className="p-3 text-center">
                                                <div className="inline-flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        aria-label="Kurangi jumlah"
                                                        onClick={() => handleDecrease(item.id_cart_item, item.quantity)}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        aria-label="Tambah jumlah"
                                                        onClick={() => handleIncrease(item.id_cart_item, item.quantity)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </td>
                                            <td className="p-3 text-right font-semibold">{formatPrice(item.subtotal)}</td>
                                            <td className="p-3 text-center">
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    aria-label="Hapus item"
                                                    onClick={() => handleDelete(item.id_cart_item)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-between rounded-lg border border-blue-400 p-4 text-gray-600">
                            <div className="mb-4 flex items-center gap-2 sm:mb-0">
                                <input
                                    type="checkbox"
                                    className="scale-150 transform"
                                    checked={checkedItems.length === items.length}
                                    onChange={toggleAll}
                                />
                                <span>Total Produk ({totalItems})</span>
                                <button className="ml-4 rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">Hapus</button>
                            </div>

                            <div className="mb-4 flex flex-col items-center text-sm sm:mb-0">
                                <div>
                                    Sub Total : <span className="font-semibold text-blue-600">{formatPrice(subtotal)}</span>
                                </div>
                                <div>
                                    Hemat : <span className="font-semibold text-red-600">({Math.round(discountPercent * 100)}%)</span>{' '}
                                    {formatPrice(discountAmount)}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-lg font-semibold text-blue-600">Total : {formatPrice(totalAfterDiscount)}</div>
                                <button
                                    className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
function toast(arg0: { title: string; description: string; variant: string }) {
    throw new Error('Function not implemented.');
}
