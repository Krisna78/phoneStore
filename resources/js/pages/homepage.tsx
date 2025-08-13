import { Button } from '@/components/ui/button';
import { Head, Link} from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type CategoryItem = { id: number; label: string; image: string; };
type ProductItem = { id_product: number; name: string; price: number; originalPrice: number; discount: number; image: string; };

type HomepageProps = {
  user: { name: string } | null;
  products: ProductItem[];
};

export default function Homepage({ user,products }: HomepageProps) {
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

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? Number(price) : price;

    if (isNaN(numPrice)) {
        return 'Rp. -';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(numPrice).replace('Rp', 'Rp. ');
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title='PhoneStore - Belanja Gadget Terbaik' />

      {/* Header */}
      <Header user={user} cartItemCount={products.length}/>

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
        {products.map((product) => {
            return (
            <Link
                key={product.id_product}
                href={route('products.show', { id: product.id_product})}
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
                    <p className="font-bold text-blue-600">{formatPrice(product.price)}</p>
                    <p className="text-xs text-gray-400 line-through hidden">
                    {formatPrice(product.originalPrice)}
                    </p>
                </div>
                </div>
            </Link>
            );
        })}
        </div>
      </section>
      <Footer/>
    </div>
  );
}
