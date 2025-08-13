import { Head, router } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
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
  price: string;
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

export default function CartPage({ user, cart }: CartPageProps) {
  const items = cart.cart_items ?? [];
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleItem = (itemId: number) => {
    setCheckedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
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

  // Hanya item yang dicentang yang ikut dihitung
  const selectedItems = items.filter((item) =>
    checkedItems.includes(item.id_cart_item)
  );
  const totalItems = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = subtotal * discountPercent;
  const totalAfterDiscount = subtotal - discountAmount;

  return (
    <div className="bg-white min-h-screen">
      <Head title="Keranjang" />
      <Header user={user} cartItemCount={totalItems} />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

        {items.length === 0 ? (
          <p>Keranjang kosong.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full border-collapse table-auto text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">
                      <input
                        type="checkbox"
                        className="transform scale-150"
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
                    <tr
                      key={item.id_cart_item}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="transform scale-150"
                          checked={checkedItems.includes(item.id_cart_item)}
                          onChange={() => toggleItem(item.id_cart_item)}
                        />
                      </td>
                      <td className="p-3 flex items-center gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          {item.price < Number(item.product.price) && (
                            <p className="line-through text-gray-400 text-xs">
                              {formatPrice(Number(item.product.price))}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-blue-600 font-semibold">
                        {formatPrice(item.price)}
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            aria-label="Kurangi jumlah"
                            onClick={() =>
                              handleDecrease(item.id_cart_item, item.quantity)
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            aria-label="Tambah jumlah"
                            onClick={() =>
                              handleIncrease(item.id_cart_item, item.quantity)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="p-3 text-right font-semibold">
                        {formatPrice(item.subtotal)}
                      </td>
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

            <div className="mt-8 flex flex-wrap justify-between items-center border border-blue-400 rounded-lg p-4 text-gray-600">
              {/* Checkbox + Total Produk */}
              <div className="flex items-center gap-2 mb-4 sm:mb-0">
                <input
                  type="checkbox"
                  className="transform scale-150"
                  checked={checkedItems.length === items.length}
                  onChange={toggleAll}
                />
                <span>Total Produk ({totalItems})</span>
                <button className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">
                  Hapus
                </button>
              </div>

              {/* Subtotal dan Hemat */}
              <div className="flex flex-col items-center text-sm mb-4 sm:mb-0">
                <div>
                  Sub Total :{' '}
                  <span className="text-blue-600 font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div>
                  Hemat :{' '}
                  <span className="text-red-600 font-semibold">
                    ({Math.round(discountPercent * 100)}%)
                  </span>{' '}
                  {formatPrice(discountAmount)}
                </div>
              </div>

              {/* Total & Checkout */}
              <div className="flex items-center gap-4">
                <div className="text-lg font-semibold text-blue-600">
                  Total : {formatPrice(totalAfterDiscount)}
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold">
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
