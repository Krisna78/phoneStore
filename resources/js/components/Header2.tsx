import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { ChevronDown, SearchIcon, ShoppingCart, User2Icon, X, XIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';

type HeaderProps = {
    user: { name: string; role?: string } | null;
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
        <header className="sticky top-0 z-10 m-0 flex min-w-full flex-col bg-primary px-2.5 md:px-3 lg:px-9">
            <nav className="flex items-center justify-between gap-2 p-4 text-white md:py-5 lg:px-5 lg:py-6">
                {/* Left (Logo) */}
                <Link href={route('homepage')} className="hidden cursor-pointer font-extrabold text-white md:flex md:text-xl lg:text-3xl">
                    PhoneStore
                </Link>

                {/* Middle (Searchbar) */}
                <div
                    ref={searchRef}
                    className="relative flex max-w-xs flex-1 items-center gap-3 rounded-md bg-white px-2 py-1.5 md:max-w-md md:px-4 md:py-1.5 lg:max-w-2xl lg:gap-4 lg:px-6 lg:py-2.5"
                >
                    <SearchIcon className="size-5 text-gray-500 lg:size-6" />
                    <form onSubmit={handleSubmit} className="w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Cari gadget disini"
                            className="flex w-full border-none text-xs text-black outline-none focus:text-black md:text-[12px] lg:text-base"
                        />
                    </form>
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSuggestions([]);
                            }}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                        >
                            <XIcon className="h-4 w-4" />
                        </button>
                    )}
                    {/* Suggestion Box */}
                    {showSuggestions && (
                        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
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
                            \
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

                {/* Right (User & Cart) */}
                <div className="flex shrink-0 items-center gap-2 md:gap-4 lg:gap-6">
                    {user ? (
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Cart */}
                            <Button
                                onClick={() => router.visit(route('carts.index'))}
                                className="relative h-full w-fit border-1 bg-white hover:border-white hover:bg-accent md:px-0.5 md:py-2 lg:p-2"
                            >
                                <ShoppingCart className="size-3.5 text-primary md:size-4 lg:size-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white lg:h-5 lg:w-5 lg:text-xs">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Button>

                            {/* Dropdown User */}
                            <div ref={dropdownRef} className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex h-fit items-center justify-center gap-1 rounded bg-white px-2 py-1.5 text-sm font-medium text-primary hover:bg-gray-100 md:gap-2 md:px-3 md:py-2 lg:py-2"
                                >
                                    <User2Icon className="size-5 md:size-4.5 lg:size-5" />
                                    {/* Nama hanya muncul di md+ */}
                                    <span className="hidden font-medium md:inline md:text-[13px] lg:text-[15px]">{user?.name}</span>
                                    <ChevronDown className={`size-3 transition-transform md:size-3 lg:size-4 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-fit rounded-md border border-gray-200 bg-white shadow-lg md:w-full">
                                        <Link
                                            href={route('profile.edit')}
                                            className="md:text-md lg:text-md block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Settings
                                        </Link>
                                        <Link
                                            href={route('invoice.purchase')}
                                            className="md:text-md lg:text-md block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Pembelian
                                        </Link>
                                        {role === 'admin' && (
                                            <Link
                                                href={route('dashboard')}
                                                className="md:text-md lg:text-md block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => router.post(route('logout'))}
                                            className="md:text-md lg:text-md w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 lg:gap-2">
                            <Link href={route('register')} className="hidden md:block">
                                <button className="rounded-md border border-white bg-white px-2 py-1 text-xs font-medium text-primary hover:bg-transparent hover:text-white md:px-4 md:py-1.5 lg:px-6 lg:py-2 lg:text-lg">
                                    Daftar
                                </button>
                            </Link>
                            <Link href={route('login')}>
                                <button className="rounded-lg border border-white px-2 py-1 text-xs font-normal text-white hover:bg-white hover:text-primary md:px-4 md:py-1.5 lg:px-6 lg:py-2 lg:text-lg">
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
