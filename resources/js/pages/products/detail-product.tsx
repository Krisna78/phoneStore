import { Head } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { CheckCircle, ChevronLeft, ChevronRight} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type DetailProductProps = {
  user: { name: string };
  product: {
    id: string
    name: string
    price: number
    oldPrice?: number
    description: string
    image: string
    images?: string[]
    sold?: number
    specs?: { label: string; value: string }[]
  }
}

const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? Number(price) : price;

    if (isNaN(numPrice)) {
        return 'Rp. -';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
        .format(numPrice)
        .replace('Rp', 'Rp. ');
};

export default function DetailProduct({ user,product }: DetailProductProps) {
  if (!product) return <div>Loading...</div>

  return (
    <div className="bg-white min-h-screen">
      <Head title={product.name} />
      <Header user={user}/>
      {/* main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <span className="hover:text-blue-600 cursor-pointer">Home</span> &gt;
          <span className="hover:text-blue-600 cursor-pointer"> Smartphone</span> &gt;
          <span className="text-gray-700"> {product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg border"
            />
            {product.images && product.images.length > 0 && (
              <div className="flex items-center mt-4 gap-2">
                <button className="p-2 rounded-full border">
                  <ChevronLeft />
                </button>
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    className="w-16 h-16 object-cover rounded-lg border cursor-pointer"
                  />
                ))}
                <button className="p-2 rounded-full border">
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.sold ?? 0} Terjual</p>

            <div className="mt-3">
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>
              {product.oldPrice && (
                <p className="text-gray-400 line-through text-lg">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Beli Sekarang
              </Button>
              <Button size="lg" variant="outline">
                Tambah Keranjang
              </Button>
            </div>

            {/* Garansi */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Layanan Resmi dapat dilakukan di seluruh Apple Authorized Service Center di
                Indonesia
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Garansi 1 Tahun dari Apple Store / Digimap
              </div>
            </div>
          </div>
        </div>

        {/* Deskripsi Produk */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Deskripsi Produk</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Spesifikasi */}
        {product.specs && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Spesifikasi Produk</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {product.specs.map((spec, idx) => (
                <div key={idx} className="flex">
                  <span className="font-semibold w-32">{spec.label}</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  )
}
