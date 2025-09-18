import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { ChevronDown, SearchIcon, ShoppingCart, User2Icon, XIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type HeaderProps = {
    user: { id: number; name: string; role?: string } | null;
    cartItemCount?: number;
    initialSearch?: string;
};
type ProductSuggestion =
    | { id: number; name: string; price: number; brand: string; category: string; redirect?: never }
    | { id?: null; name: string; redirect: string };

export default function Header2({ user, cartItemCount = 0, initialSearch = '' }: HeaderProps) {
    // note:
    // 1. bikin konsep header2 suggestion didlam suggestion ada apa aja mau munculin apa kayak Dropdownopen,drowpdownclose,dan data dari yang sudah ditampung tadi
    // 2. bikin konsep header2 untuk struktur design
    // 3.  bikin functionnya untuk setiap fungsi yang dibutuhkan untuk setiap komponen atau fitur
    // 4. hidden untuk cart dan user icon kalau belum login

    const [search, setSearch] = useState(initialSearch);
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const role = (usePage().props.auth as { user?: { role?: string } })?.user?.role ?? 'guest';

    // Close dropdown kalau klik di luar
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

    // Debounced fetch suggestion

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

    // Load & save history search
    useEffect(() => setHistory(JSON.parse(localStorage.getItem('searchHistory') || '[]')), []);

    const saveHistory = (term: string) => {
        if (!term.trim()) return;
        const updated = [term, ...history.filter((h) => h.toLowerCase() !== term.toLowerCase())].slice(0, 5);
        setHistory(updated);
        localStorage.setItem(`searchHistory`, JSON.stringify(updated));
    };
    // Handler search input
    const handleSearchChange = (v: string) => {
        setSearch(v);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        v.trim() ? debouncedFetch(v) : setSuggestions([]);
        setShowSuggestions(true);
    };

    // Submit search
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        saveHistory(search);
        router.get('/product', { search });
        setShowSuggestions(false);
    };

    return (
        <header className="sticky top-0 z-10 m-0 flex min-w-full flex-col bg-primary px-2.5 md:px-4 lg:px-9">
            <nav className="flex items-center justify-between p-4 text-white md:p-4 lg:px-5 lg:py-6.5">
                <Link href={route('homepage')} className="hidden cursor-pointer text-2xl font-extrabold text-white md:flex lg:text-3xl">
                    PhoneStore
                </Link>

                {/* searchbar */}
                <div
                    ref={searchRef}
                    className="text-third3 relative flex max-w-sm items-center gap-3 rounded-md bg-white px-2 py-1 md:w-full md:py-2 lg:max-w-2xl lg:gap-4 lg:px-6 lg:py-3.5"
                >
                    <SearchIcon className="size-5 text-gray-500 lg:size-7" />
                    <form onSubmit={handleSubmit} className="w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Cari gadget disini"
                            className="md:text-md flex w-full border-none text-xs text-black outline-none focus:text-black lg:text-base"
                        />
                    </form>

                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSuggestions([]);
                            }}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                        >
                            <XIcon className="h-4 w-4" />
                        </button>
                    )}

                    {/* Suggestion Box */}
                    {showSuggestions && (
                        <div className="absolute top-full right-0 left-0 mt-1 max-h-80 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                            {/* Riwayat Pencarian */}
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

                            {/* Hasil suggestion */}
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

                {/* user, chart, login,register */}
                <div className="flex items-center gap-2 md:mr-2 lg:gap-6">
                    {user ? (
                        // Kalau user sudah login
                        <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
                            {/* Cart */}
                            <button onClick={() => router.visit(route('carts.index'))} className="relative">
                                <ShoppingCart className="size-5 cursor-pointer text-white md:size-6 lg:size-8" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown User */}
                            <div className="relative rounded-md border-white bg-white p-1 hover:bg-gray-100 lg:px-3 lg:py-2" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 rounded px-3 py-1 text-sm font-medium text-primary"
                                >
                                    <User2Icon className="size-5 text-primary" />
                                    {user?.name}
                                    <ChevronDown />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 z-20 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg">
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
                                            onClick={() => router.post(route('logout'))}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Kalau belum login
                        <div className="flex items-center gap-1 lg:gap-2">
                            <button className="hidden cursor-pointer rounded-md border border-white bg-white px-2 py-1 text-[12px] font-medium text-primary hover:bg-transparent hover:text-white md:flex md:px-4 md:py-1.5 lg:px-6 lg:py-2 lg:text-lg">
                                <Link href={route('register')}>Daftar</Link>
                            </button>
                            <Link href={route('login')}>
                                <button className="cursor-pointer rounded-lg border border-white px-2 py-1 text-[12px] font-normal text-white hover:bg-white hover:text-primary md:px-4 md:py-1.5 lg:px-6 lg:py-2 lg:text-lg">
                                    Login
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
