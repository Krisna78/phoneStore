// components/Header.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { Search, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type HeaderProps = {
  user: { name: string } | null;
};

export default function Header({ user }: HeaderProps) {
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

  function handleLogout() {
    router.post(route('logout'));
    setDropdownOpen(false);
  }
  function handleLoginClick(e: React.MouseEvent) {
    e.preventDefault();
    router.visit(route('login'));
  }

  return (
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
        >
          <Search className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500">
          <ShoppingCart className="h-5 w-5" />
        </Button>

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
            <Button asChild variant="outline" className="hidden border-white bg-white px-4 text-blue-600 hover:bg-blue-400 md:inline-flex">
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
