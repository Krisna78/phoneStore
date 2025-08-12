import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, Link, router } from '@inertiajs/react';
import { Search, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type CategoryItem = { id: number; label: string; image: string; };
type ProductItem = { id: number; name: string; price: number; originalPrice: number; discount: number; image: string; };

type HomepageProps = {
  user: { name: string } | null;
};

export default function Homepage({ user }: HomepageProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: CategoryItem[] = [
    {
      id: 1,
      label: 'Smartphone',
      image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg',
    },
    {
      id: 2,
      label: 'Tablet',
      image: 'https://assets.telkomsel.com/public/2024-12/5-Tablet-Samsung-Terbaru-Kamu-Incar-yang-Mana.png',
    },
    {
      id: 3,
      label: 'Laptop',
      image: 'https://www.asus.com/media/Odin/Websites/global/Series/9.png',
    },
    {
      id: 4,
      label: 'Aksesoris',
      image: 'https://cdn.eraspace.com/pub/media/catalog/product/cache/1/image/500x500/e4c4a5b6f9b6928e986b508a5c8c0e2f/a/p/apple_airpods_pro_2nd_gen_mqd83_1.jpg',
    },
    {
      id: 5,
      label: 'Smartwatch',
      image: 'https://cdn.eraspace.com/pub/media/catalog/product/cache/1/image/500x500/e4c4a5b6f9b6928e986b508a5c8c0e2f/a/p/apple_watch_series_9_gps_41mm_starlight_aluminum_starlight_sport_band_1_1.jpg',
    },
  ];

  const products: ProductItem[] = Array(10).fill({
    id: 1,
    name: 'Infinix Smart 10 Plus 8/128GB - Black',
    price: 1750000,
    originalPrice: 2500000,
    discount: 30,
    image: 'https://fdn2.gsmarena.com/vv/pics/infinix/infinix-smart-8-1.jpg',
  }).map((item, index) => ({ ...item, id: index + 1 }));

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price).replace('Rp', 'Rp. ');
  };

  function handleLogout() {
    router.post(route('logout'));
    setDropdownOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title='PhoneStore - Belanja Gadget Terbaik' />

      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col items-center justify-between gap-3 bg-blue-600 px-4 py-3 text-white shadow-md md:flex-row md:gap-0 md:px-6">
        <Link href="/" className="text-xl font-bold hover:text-blue-100">
          PhoneStore
        </Link>

        {/* Search Bar */}
        <div className="w-full max-w-xl md:mx-6 md:flex-1">
          <div className="relative hidden w-full md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />
            <Input
              type="text"
              placeholder="Cari Smartphone, Tablet, Laptop..."
              className="w-full bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          {showSearch && (
            <div className="relative mt-2 w-full animate-fade-in md:hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />
              <Input
                type="text"
                placeholder="Cari Smartphone, Tablet, Laptop..."
                className="w-full bg-white py-2 pl-10 pr-4 text-sm text-gray-800"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-500 md:hidden"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Keranjang Belanja</span>
          </Button>

          {/* User login/logout */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-white bg-white px-4 text-blue-600 hover:bg-blue-100 md:inline-flex"
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
              <Button asChild variant="outline" className="hidden border-white bg-white px-4 text-blue-600 hover:bg-blue-100 md:inline-flex">
                <Link href={route('register')}>Daftar</Link>
              </Button>

              <Button asChild className="hidden bg-blue-700 px-4 text-white hover:bg-blue-800 md:inline-flex">
                <Link href={route('login')}>Login</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative aspect-[16/6] w-full overflow-hidden bg-gray-200">
        <img
          src="/images/rectangle_5.png"
          alt="Promo Spesial"
          className="h-full w-full object-fill object-center"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-8 md:px-6">
        <h2 className="mb-4 text-xl font-bold text-gray-800 md:text-2xl">Kategori Populer</h2>
        <div className="relative">
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-50">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-center text-sm font-medium text-gray-800">{category.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 pb-12 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
            Pilihan terbaik untuk <span className="text-blue-600">Smartphone</span>
          </h2>
          <Button variant="link" className="text-blue-600 hover:underline" asChild>
            <Link href="/products">Lihat Semua</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {product.discount > 0 && (
                  <span className="absolute left-2 top-2 rounded bg-yellow-400 px-2 py-1 text-xs font-bold">
                    {product.discount}% off
                  </span>
                )}
              </div>

              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-gray-800">
                  {product.name}
                </h3>
                <div className="mt-2">
                  <p className="font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
