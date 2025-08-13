<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::with('cartItems.product')->where('user_id', $user->id_user)->first();
        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user->id_user,
            ]);
        }
        return Inertia::render('cart/cart', ['cart' => $cart]);
    }
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id_product',
            'quantity' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id_user],
            ['created_at' => now(), 'updated_at' => now()]
        );

        $product = Product::findOrFail($request->product_id);
        CartItem::create([
            'cart_id' => $cart->id_cart,
            'product_id' => $product->id_product,
            'quantity' => $request->quantity ?? 1,
            'price' => $product->price,
            'subtotal' => $product->price * ($request->quantity ?? 1)
        ]);
        return redirect()->route('carts.index')->with('success', 'Produk berhasil ditambahkan ke keranjang');
    }
    public function destroy($id) {
        $cart = CartItem::findOrFail($id);
        $cart->delete();
        return redirect()->route("carts.index")->with("success", "Kategori Berhasil di hapus");
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        $cartItem = CartItem::findOrFail($id);
        $cartItem->quantity = $request->quantity;
        $cartItem->subtotal = $cartItem->price * $request->quantity;
        $cartItem->save();

        return redirect()->route('carts.index')->with('success', 'Quantity berhasil diperbarui');
    }
}
