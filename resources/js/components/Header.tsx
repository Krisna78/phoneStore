// components/Header.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Search, ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type HeaderProps = {
    user: { name: string } | null;
    cartItemCount?: number;
    initialSearch?: string;
};

type ProductSuggestion = {
    id: number;
    name: string;
    price: number;
    image_url: string;
    brand: string;
    category: string;
};

export default function Header({ user, cartItemCount = 0, initialSearch = '' }: HeaderProps) {
    const [showSearch, setShowSearch] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState(initialSearch);
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

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
                }, 300);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleLogout() {
        router.post(route('logout'));
        setDropdownOpen(false);
    }
    function handleLoginClick(e: React.MouseEvent) {
        e.preventDefault();
        router.visit(route('login'));
    }
    function handleCartClick() {
        router.visit(route('carts.index'));
    }

    const fetchSuggestions = debounce(async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        try {
            const { data } = await axios.get(`/search-suggestions`, { params: { q: query } });
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (err) {
            console.error(err);
        }
    }, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        fetchSuggestions(value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { search });
        setShowSuggestions(false);
    };

    return (
        <header className="sticky top-0 z-10 flex flex-col items-center justify-between gap-3 bg-blue-600 px-4 py-3 text-white shadow-md md:flex-row md:gap-0 md:px-6">
            <Link href="/" className="text-xl font-bold hover:text-blue-100">
                PhoneStore
            </Link>

            {/* Search Bar */}
            <div ref={searchRef} className="relative w-full max-w-xl md:mx-6 md:flex-1">
                <form onSubmit={handleSearchSubmit} className="relative hidden w-full md:block">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-600" />
                    <Input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(suggestions.length > 0)}
                        placeholder="Cari Smartphone, Tablet, Laptop..."
                        className="w-full bg-white py-2 pr-4 pl-10 text-sm text-gray-800 placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                </form>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute right-0 left-0 z-20 mt-1 max-h-80 overflow-y-auto rounded-md bg-white shadow-lg">
                        {suggestions.map((item) => (
                            <Link
                                key={item.id}
                                href={`/products/${item.id}`}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                                onClick={() => setShowSuggestions(false)}
                            >
                                <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded object-cover" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {item.brand} • {item.category}
                                    </p>
                                    <p className="text-xs font-semibold text-blue-600">Rp {item.price.toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {showSearch && (
                    <div className="animate-fade-in relative mt-2 w-full md:hidden">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-600" />
                        <Input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            onFocus={() => setShowSuggestions(suggestions.length > 0)}
                            placeholder="Cari Smartphone, Tablet, Laptop..."
                            className="w-full bg-white py-2 pr-4 pl-10 text-sm text-gray-800"
                        />
                    </div>
                )}
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
                <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500 md:hidden" onClick={() => setShowSearch(!showSearch)}>
                    <Search className="h-5 w-5" />
                </Button>

                {user && (
                    <Button variant="ghost" size="icon" className="relative bg-white text-white" onClick={handleCartClick} aria-label="Cart">
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
                                    onClick={handleLogout}
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
                        <Button asChild className="hidden bg-blue-700 px-4 text-white hover:bg-blue-800 md:inline-flex" onClick={handleLoginClick}>
                            <Link href={route('login')}>Login</Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}
