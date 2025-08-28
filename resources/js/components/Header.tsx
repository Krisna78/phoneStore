import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Search, ShoppingCart, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type HeaderProps = {
    user: { name: string } | null;
    cartItemCount?: number;
    initialSearch?: string;
};

type ProductSuggestion =
    | {
          id: number;
          name: string;
          price: number;
          brand: string;
          category: string;
          redirect?: never;
      }
    | {
          id?: null;
          name: string;
          price?: null;
          brand?: null;
          category?: null;
          redirect: string;
      };

export default function Header({ user, cartItemCount = 0, initialSearch = '' }: HeaderProps) {
    const [showSearch, setShowSearch] = useState(false); // ⬅️ Mobile search toggle
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState(initialSearch);
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setTimeout(() => {
                    setDropdownOpen(false);
                    setShowSuggestions(false);
                }, 150);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // fetch suggestion debounce
    const debouncedFetch = useMemo(
        () =>
            debounce(async (query: string) => {
                if (!query.trim()) {
                    setSuggestions([]);
                    return;
                }
                try {
                    const { data } = await axios.get(`/search-suggestions`, {
                        params: { q: query },
                    });
                    setSuggestions(data);
                } catch (err: any) {
                    console.error('search-suggestions error:', err?.response?.status, err?.response?.data || err);
                    setSuggestions([]);
                }
            }, 300),
        [],
    );

    useEffect(() => {
        return () => debouncedFetch.cancel();
    }, [debouncedFetch]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setHistory(saved);
    }, []);

    const saveSearchHistory = (term: string) => {
        if (!term.trim()) return;
        let updated = history.filter((item) => item.toLowerCase() !== term.toLowerCase());
        updated.unshift(term);
        updated = updated.slice(0, 5);
        setHistory(updated);
        localStorage.setItem('searchHistory', JSON.stringify(updated));
    };

    const removeHistoryItem = (term: string) => {
        const updated = history.filter((item) => item !== term);
        setHistory(updated);
        localStorage.setItem('searchHistory', JSON.stringify(updated));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('searchHistory');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        if (value.trim()) {
            debouncedFetch(value);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(true); // kalau kosong, tetap buka history
            setSuggestions([]);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        saveSearchHistory(search);
        router.get('/products', { search });
        setShowSuggestions(false);
        setShowSearch(false); // ⬅️ Tutup search di mobile setelah submit
    };

    return (
        <header className="sticky top-0 z-10 flex flex-col items-center justify-between gap-3 bg-blue-600 px-4 py-3 text-white shadow-md md:flex-row md:gap-0 md:px-6">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold hover:text-blue-100">
                PhoneStore
            </Link>

            {/* Search Bar Desktop */}
            <div ref={searchRef} className="relative w-full max-w-xl md:mx-6 md:flex-1">
                <form onSubmit={handleSearchSubmit} className="relative hidden w-full md:block">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-600" />
                    <Input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Cari Smartphone, Tablet, Laptop..."
                        className="w-full bg-white py-2 pr-4 pl-10 text-sm text-gray-800 placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                </form>

                {/* Search Box Mobile ⬅️ Tambahan */}
                {showSearch && (
                    <form onSubmit={handleSearchSubmit} className="relative block w-full md:hidden mt-2">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-600" />
                        <Input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Cari produk..."
                            className="w-full bg-white py-2 pr-10 pl-10 text-sm text-gray-800 placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                        {/* Close Button (X) ⬅️ Tambahan */}
                        <button
                            type="button"
                            onClick={() => {
                                setShowSearch(false);
                                setSearch('');
                                setShowSuggestions(false);
                            }}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </form>
                )}

                {/* Suggestion Box (dipakai Desktop & Mobile) */}
                {showSuggestions && (
                    <div className="absolute right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                        {/* History */}
                        {!search.trim() && history.length > 0 && (
                            <div className="px-2 py-2">
                                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-gray-500">
                                    <span>Riwayat Pencarian</span>
                                    <button onClick={clearHistory} className="text-[11px] text-red-500 hover:underline" type="button">
                                        Hapus semua
                                    </button>
                                </div>
                                {history.map((h, i) => (
                                    <div key={i} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
                                        <Link
                                            href={`/products?search=${encodeURIComponent(h)}`}
                                            className="text-sm text-gray-700"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            {h}
                                        </Link>
                                        <button onClick={() => removeHistoryItem(h)} type="button" className="text-gray-400 hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Suggestions */}
                        {search.trim() && suggestions.length > 0 && (
                            <>
                                {suggestions.map((item) =>
                                    item.redirect ? (
                                        <Link
                                            key={`redirect-${item.name}`}
                                            href={item.redirect}
                                            className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <Link
                                            key={item.id}
                                            href={route('products.show.details', { id: item.id })}
                                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-800">{item.name}</span>
                                                <span className="text-xs text-gray-500">{item.brand}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-blue-600">{item.category}</span>
                                        </Link>
                                    ),
                                )}
                            </>
                        )}

                        {/* Fallback link */}
                        {search.trim() &&
                            !suggestions.some((item) => item.redirect && item.redirect.includes(`search=${search}`)) && (
                                <Link
                                    href={`/products?search=${encodeURIComponent(search)}`}
                                    className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
                                    onClick={() => setShowSuggestions(false)}
                                >
                                    Lihat semua produk "{search}"
                                </Link>
                            )}
                    </div>
                )}
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Search toggle Mobile ⬅️ Tambahan */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-blue-500 md:hidden"
                    onClick={() => setShowSearch(!showSearch)}
                >
                    <Search className="h-5 w-5" />
                </Button>

                {user && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative bg-white text-white"
                        onClick={() => router.visit(route('carts.index'))}
                        aria-label="Cart"
                    >
                        <ShoppingCart className="h-5 w-5 text-blue-500" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                {cartItemCount}
                            </span>
                        )}
                    </Button>
                )}

                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-white bg-white px-4 text-blue-600 hover:bg-blue-400"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {user.name}
                            <svg
                                className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </Button>
                        {dropdownOpen && (
                            <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                                <Link
                                    href="/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    type="button"
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                        router.post(route('logout'));
                                        setDropdownOpen(false);
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Button
                            asChild
                            variant="outline"
                            className="hidden border-white bg-white px-4 text-blue-600 hover:bg-blue-400 md:inline-flex"
                        >
                            <Link href={route('register')}>Daftar</Link>
                        </Button>
                        <Button asChild className="hidden bg-blue-700 px-4 text-white hover:bg-blue-800 md:inline-flex">
                            <Link href={route('login')}>Login</Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}
