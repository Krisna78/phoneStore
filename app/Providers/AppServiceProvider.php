<?php

namespace App\Providers;

use App\Models\CartItem;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
        'user' => function () {
            return Auth::user()
                ? [
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                ]
                : null;
        },
    ]);
    Inertia::share([
        'cartCount' => function () {
            $user = auth()->user();
            if (!$user || !$user->hasRole('user')) {
                return 0;
            }
            $cardBadge = CartItem::whereHas('cart', function ($query) use ($user) {
                $query->where('user_id', $user->id_user);
            })->count();
            return $cardBadge;
        },
    ]);
    }
}
