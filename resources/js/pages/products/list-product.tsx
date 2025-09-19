import Footer from '@/components/Footer';
import Header2 from '@/components/Header2';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiFilter, FiX } from 'react-icons/fi';

const filters = {
  harga: ['Harga Tertinggi', 'Harga Terendah'],
};

type Brand = {
  id_merk: number;
  merk_name: string;
};

type Product = {
  id_product: number;
  name: string;
  price: string;
  image: string;
  merk?: { id_merk?: number; merk_name: string };
  category?: { id_category?: number; category_name: string };
};

type PageProps = {
  user: { name: string } | null;
  products: Product[];
  brands: Brand[];
  categoryId: number;
  cartCount: number;
};

export default function SmartphonePage({ user, products, brands, cartCount }: PageProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ harga: false, brand: false });
  // simpan semua produk & hasil filter
  const [allProducts] = useState<Product[]>(products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  // state filter
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  // toggle harga dan brand
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // refresh filter setiap kali filter berubah
  useEffect(() => {
    let result = [...allProducts];
    // filter brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.merk?.id_merk ?? -1));
    }
    // filter harga
    if (selectedPrice) {
      if (selectedPrice === 'Harga Tertinggi') {
        result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectedPrice === 'Harga Terendah') {
        result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
      }
    }

    setFilteredProducts(result);
  }, [selectedBrands, selectedPrice, allProducts]);

  // function filter brand
  const handleBrandChange = (brand: number, checked: boolean) => {
    if (checked) {
      setSelectedBrands((prev) => (prev.includes(brand) ? prev : [...prev, brand]));
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  // function filter harga tertinggi dan terendah
  const handlePriceChange = (priceOption: string, checked: boolean) => {
    setSelectedPrice(checked ? priceOption : null);
  };

  // function clear all filters
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedPrice(null);
    setFilteredProducts(allProducts);
  };

  return (
    <>
      <Header2 user={user} cartItemCount={cartCount} />

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Filter Toggle */}
        <div className="mb-4 flex md:hidden">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            <FiFilter size={18} />
            <span>Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar Filter */}
          <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:col-span-3 md:block`}>
            <div className="relative rounded-2xl border bg-white p-4 shadow-sm">
              <button onClick={() => setIsFilterOpen(false)} className="absolute top-3 right-3 md:hidden">
                <FiX size={20} />
              </button>

              <h2 className="mb-4 text-lg font-bold">Filter Produk</h2>

              {/* Tombol Clear Filter */}
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mb-4 w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Clear Filter
              </Button>

              {/* Filter Harga */}
              <div className="mb-6">
                <button
                  className="flex w-full items-center justify-between py-2 font-semibold"
                  onClick={() => toggleSection('harga')}
                >
                  <span>Harga</span>
                  {openSections.harga ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openSections.harga && (
                  <div className="mt-2 pl-2">
                    {filters.harga.map((item) => (
                      <label key={`harga-${item}`} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          checked={selectedPrice === item}
                          onCheckedChange={(checked) => handlePriceChange(item, checked === true)}
                          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Brand */}
              <div>
                <button
                  className="flex w-full items-center justify-between py-2 font-semibold"
                  onClick={() => toggleSection('brand')}
                >
                  <span>Brand</span>
                  {openSections.brand ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openSections.brand && (
                  <div className="mt-2 grid grid-cols-1 gap-2 pl-2">
                    {brands.map((item, index) => (
                      <label
                        key={`brand-${item.id_merk ?? item.merk_name ?? index}`}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          checked={selectedBrands.includes(item.id_merk)}
                          onCheckedChange={(checked) => {
                            handleBrandChange(item.id_merk, checked === true);
                          }}
                          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <span className="text-sm">{item.merk_name || 'Unknown Brand'}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Produk Grid */}
          <main className="md:col-span-9">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">Menampilkan {filteredProducts.length} produk</p>

              {/* Clear Filter di atas grid */}
              {(selectedBrands.length > 0 || selectedPrice) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Clear Filter
                </Button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id_product}
                    className="overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <Link href={route('products.show.details', { id: product.id_product })}>
                      <div className="h-48 w-full overflow-hidden sm:h-52">
                        <img
                          src={
                            product.image?.startsWith('http')
                              ? product.image
                              : product.image
                              ? `/storage/${product.image}`
                              : '/placeholder.png'
                          }
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-3 sm:p-4">
                        <h4 className="line-clamp-2 text-sm font-medium text-gray-900 sm:text-base">
                          {product.name}
                        </h4>
                        <p className="mt-2 text-base font-semibold text-blue-600 sm:text-lg">
                          Rp {Number(product.price).toLocaleString('id-ID')}
                        </p>
                        {product.merk && (
                          <p className="mt-1 text-xs text-gray-500 sm:text-sm">{product.merk.merk_name}</p>
                        )}
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-gray-100 p-4">
                  <FiX size={32} className="text-gray-400" />
                </div>
                <p className="mt-4 text-gray-500">Belum ada produk yang sesuai dengan filter.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
