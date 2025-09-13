import { Link } from '@inertiajs/react';
import axios from 'axios';
import { SearchIcon, ShoppingCart, User2Icon } from 'lucide-react';
import { useState } from 'react';

type HeaderProps = {
    user: { name: string } | null;
    cartItemCount?: number;
    // initialSearch?: string;
};
type ProductSuggestion =
    | {
          id: number;
          name: string;
          image: string;
          price: number;
          brand: string;
          category: string;
          redirect: never;
      }
    | {
          id?: null;
          name: string;
          image: string;
          price: never;
          brand: never;
          category: never;
          redirect: string;
      };

export default function Header2({ user, cartItemCount }: HeaderProps) {
    // note:
    // 1. bikin konsep header2 suggestion didlam suggestion ada apa aja mau munculin apa kayak Dropdownopen,drowpdownclose,dan data dari yang sudah ditampung tadi
    // 2. bikin konsep header2 untuk struktur design
    // 3.  bikin functionnya untuk setiap fungsi yang dibutuhkan untuk setiap komponen atau fitur
    // 4. hidden untuk cart dan user icon kalau belum login

    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    //handle perubahan input
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim()) {
            try {
                const { data } = await axios.get(`/search-suggestions?q=${value}`);
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetch suggestions:', error);
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    //     const [showSearch, setShowSearch] = useState(false);
    //     const [dropdownOpen, setDropdownOpen] = useState(false);
    //     const dropdownRef = useRef<HTMLDivElement>(null);
    //     const searchRef = useRef<HTMLDivElement>(null);
    //     const [search, setSearch] = useState(false);
    //     const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    //     const [showSuggestions, setShowSuggestions] = useState(false);

    return (
        <header className="sticky top-0 z-10 m-0 flex min-w-full flex-col bg-primary px-2.5 md:px-4">
            <nav className="flex items-center justify-between p-4 text-white md:p-4 lg:px-5 lg:py-6.5">
                <Link href={route('homepage')} className="hidden cursor-pointer text-2xl font-bold text-white md:flex lg:text-3xl">
                    PhoneStore
                </Link>

                {/* searchbar */}
                <div className="text-third3 relative flex max-w-sm items-center gap-3 rounded-md bg-white px-2 py-1 md:w-full md:py-2 lg:max-w-2xl lg:gap-4 lg:px-6 lg:py-3.5">
                    <SearchIcon className="size-5 text-gray-500 lg:size-7" />
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Cari gadget disini"
                        className="md:text-md flex w-full border-none text-xs text-black outline-none focus:text-black lg:text-base"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full right-0 left-0 mt-1 max-h-[80px] overflow-y-auto rounded-md border border-gray-200 bg-white text-black shadow-lg">
                            {suggestions.map((item) => (
                                <Link
                                    key={item.id || `redirect-${item.name}`}
                                    href={item.redirect ? item.redirect : route('product.show.details', { id: item.id })}
                                    className="hover:bg-grey2 flex items-center gap-3 px-4 py-2"
                                    onClick={() => setShowSuggestions(false)}
                                >
                                    {item.image && <img src={item.image} alt={item.name} className="h-8 w-8 rounded object-cover" />}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{item.name}</span>
                                        {item.brand && <span className="text-grey1 text-xs">{item.brand}</span>}
                                    </div>
                                    {item.category && <span className="mr-auto text-xs text-primary">{item.category}</span>}
                                </Link>
                            ))}
                            {search.trim() !== '' && (
                                <Link
                                    href={route('product.index', { search })}
                                    className="hover:bg-grey2 block px-4 py-2 text-sm font-semibold text-primary"
                                    onClick={() => setShowSuggestions(false)}
                                >
                                    Lihat Semua Produk
                                </Link>
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
                            <Link href={route('carts.index')} className="relative">
                                <ShoppingCart className="size-5 cursor-pointer md:size-6 lg:size-8" />
                                {(cartItemCount ?? 0) > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                            {/* User Profile */}
                            <Link href={route('profile')}>
                                <User2Icon className="size-5 cursor-pointer md:size-6 lg:size-8" />
                            </Link>
                        </div>
                    ) : (
                        // Kalau belum login
                        <div className="flex items-center gap-1 lg:flex lg:gap-2">
                            <Link href={route('register')}>
                                <button className="border-1.5 hover:border-1.5 hidden cursor-pointer rounded-md border-white bg-white px-2 py-1 text-[12px] font-medium text-primary hover:border-1 hover:border-white hover:bg-transparent hover:text-white md:flex md:px-4 md:py-1.5 lg:px-6 lg:py-2 lg:text-lg">
                                    Daftar
                                </button>
                            </Link>
                            <Link href={route('login')}>
                                <button className="cursor-pointer rounded-lg border-1 border-white px-2 py-1 text-[12px] font-normal text-white hover:bg-white hover:text-primary md:px-4 md:py-1.5 lg:px-6 lg:py-2 lg:text-lg">
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
