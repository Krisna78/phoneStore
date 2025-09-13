import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Search, ShoppingCart, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type HeaderProps = { user: { name: string } | null; cartItemCount?: number; initialSearch?: string };

type ProductSuggestion =
    | { id: number; name: string; price: number; brand: string; category: string; redirect?: never }
    | { id?: null; name: string; redirect: string };

export default function Header({ user, cartItemCount = 0, initialSearch = '' }: HeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const role = (usePage().props.auth as { user?: { role?: string } })?.user?.role ?? 'guest';

    // Close dropdown when click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node) && !searchRef.current?.contains(e.target as Node)) {
                setTimeout(() => {
                    setDropdownOpen(false);
                    setShowSuggestions(false);
                }, 150);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Debounced fetch
    const debouncedFetch = useMemo(
        () =>
            debounce(async (q: string) => {
                if (!q.trim()) return setSuggestions([]);
                try {
                    const { data } = await axios.get(`/search-suggestions`, { params: { q } });
                    setSuggestions(data);
                } catch {
                    setSuggestions([]);
                }
            }, 300),
        [],
    );
    useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

    // Load history
    useEffect(() => setHistory(JSON.parse(localStorage.getItem('searchHistory') || '[]')), []);

    const saveHistory = (term: string) => {
        if (!term.trim()) return;
        const updated = [term, ...history.filter((h) => h.toLowerCase() !== term.toLowerCase())].slice(0, 5);
        setHistory(updated);
        localStorage.setItem('searchHistory', JSON.stringify(updated));
    };

    const handleSearchChange = (v: string) => {
        setSearch(v);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        v.trim() ? debouncedFetch(v) : setSuggestions([]);
        setShowSuggestions(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        saveHistory(search);
        router.get('/products', { search });
        setShowSuggestions(false);
    };

    return (
        <header className="sticky top-0 z-10 flex flex-col items-center justify-between gap-3 bg-blue-600 px-4 py-3 text-white shadow-md md:flex-row md:gap-0 md:px-6">
            {/* Logo */}
            <Link href="/" className="flex text-xl font-bold hover:text-blue-100">
                PhoneStore
            </Link>

            {/* Search selalu tampil */}
            <div ref={searchRef} className="relative w-full md:mx-6 md:max-w-xl md:flex-1">
                <form onSubmit={handleSubmit} className="relative mt-2 w-full md:mt-0">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-600" />
                    <Input
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Cari produk..."
                        className="w-full bg-white py-2 pr-10 pl-10 text-sm text-gray-800 placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSuggestions([]);
                            }}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>

                {/* Suggestion Box */}
                {showSuggestions && (
                    <div className="absolute right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                        {!search.trim() && history.length > 0 && (
                            <div className="px-2 py-2">
                                <div className="mb-1 flex justify-between text-xs font-semibold text-gray-500">
                                    <span>Riwayat Pencarian</span>
                                    <button
                                        onClick={() => {
                                            setHistory([]);
                                            localStorage.removeItem('searchHistory');
                                        }}
                                        className="text-[11px] text-red-500 hover:underline"
                                        type="button"
                                    >
                                        Hapus semua
                                    </button>
                                </div>
                                {history.map((h, i) => (
                                    <div key={i} className="flex justify-between px-2 py-1 hover:bg-gray-100">
                                        <button
                                            type="button"
                                            className="flex-1 text-left text-sm text-gray-700"
                                            onClick={() => {
                                                saveHistory(h); // simpan ke localStorage lagi biar tetap fresh
                                                setSearch(h);
                                                setShowSuggestions(false);
                                                router.get('/products', { search: h });
                                            }}
                                        >
                                            {h}
                                        </button>
                                        <button
                                            onClick={() => {
                                                const upd = history.filter((x) => x !== h);
                                                setHistory(upd);
                                                localStorage.setItem('searchHistory', JSON.stringify(upd));
                                            }}
                                            className="ml-2 text-gray-400 hover:text-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {search.trim() && (
                            <>
                                {suggestions.map((s, i) =>
                                    s.redirect ? (
                                        <Link
                                            key={`r-${i}`}
                                            href={s.redirect}
                                            className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            {s.name}
                                        </Link>
                                    ) : (
                                        <Link
                                            key={s.id}
                                            href={route('products.show.details', { id: s.id })}
                                            className="flex justify-between px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-800">{s.name}</span>
                                                <span className="text-xs text-gray-500">{s.brand}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-blue-600">{s.category}</span>
                                        </Link>
                                    ),
                                )}
                                {!suggestions.some((s) => s.redirect?.includes(`search=${search}`)) && (
                                    <Link
                                        href={`/products?search=${encodeURIComponent(search)}`}
                                        className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
                                        onClick={() => setShowSuggestions(false)}
                                    >
                                        Lihat semua produk "{search}"
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Right */}
            <div className="mt-2 flex items-center gap-2 md:mt-0 md:gap-4">
                {user && (
                    <Button variant="ghost" size="icon" className="relative bg-white text-white" onClick={() => router.visit(route('carts.index'))}>
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
                            className="flex gap-2 border-white bg-white px-4 text-blue-600 hover:bg-blue-400"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {user.name}
                            <svg
                                className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </Button>
                        {dropdownOpen && (
                            <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                                <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Settings
                                </Link>
                                <Link href={route('invoice.purchase')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Pembelian
                                </Link>
                                {role === 'admin' && (
                                    <Link href={route('dashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Dashboard
                                    </Link>
                                )}
                                <button
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
                        <Button asChild variant="outline" className="border-white bg-white px-4 text-blue-600 hover:bg-blue-400">
                            <Link href={route('register')}>Daftar</Link>
                        </Button>
                        <Button asChild className="bg-blue-700 px-4 text-white hover:bg-blue-800">
                            <Link href={route('login')}>Login</Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}
