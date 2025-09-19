import CategoryCard from '@/components/card-category';
import ProductCard from '@/components/card-product';
import Footer2 from '@/components/Footer2';
import Header2 from '@/components/Header2';
import Layout from '@/components/Layout';
import Banner from '@/components/ui/banner';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

type CategoryItem = {
    id_category: number;
    category_name: string;
    image: string;
};

type ProductItem = {
    id_product: number;
    name: string;
    price: number;
    soldCount?: number;
    image: string;
};

type HomepageProps = {
    user: { name: string; role?: string } | null;
    categories: CategoryItem[];
    banners: string[];
    products: ProductItem[];
};

export default function Homepage2({ user, categories, banners, products }: HomepageProps) {
    const cartCount = usePage().props.cartCount as number;
    // Ambil kategori dari props
    const smartphoneCategory = categories.find((cat) => cat.category_name === 'Smartphone');
    const tabletCategory = categories.find((cat) => cat.category_name === 'Tablet');
    const laptopCategory = categories.find((cat) => cat.category_name === 'Laptop');
    // Filter produk sesuai kategori
    const smartphoneProducts = products.filter((p) => p.category.id_category === smartphoneCategory?.id_category).slice(0, 3);
    const tabletProducts = products.filter((p) => p.category.id_category === tabletCategory?.id_category).slice(0, 3);
    const laptopProducts = products.filter((p) => p.category.id_category === laptopCategory?.id_category).slice(0, 3);
    console.log(products);

    return (
        <Layout>
            <Head title="PhoneStore - Belanja Gadget Terbaik" />

            {/* header start */}
            <Header2 user={user} cartItemCount={cartCount} />
            {/* header end */}

            {/* Hero Banner start*/}
            <Banner />
            {/* Hero Banner start*/}

            <div className="mx-1 mt-1 px-4.5 md:mt-4 md:px-6 lg:px-9">
                {/* bagaian kategori start */}
                <div className="relative">
                    <div className="flex items-center justify-between align-middle">
                        <h1 className="w-fit border-b-1 border-y-primary py-0.5 text-[10px] font-medium text-black md:border-b-2 md:text-[18px] lg:border-b-3 lg:text-[26px]">
                            Kategori
                        </h1>
                        <div className="flex cursor-pointer items-center justify-center gap-2 text-center align-middle">
                            <Link href={route('product.list.all')} className="text-[7px] font-medium text-grey1 md:text-[12px] lg:text-[14px]">
                                Lihat Semua
                            </Link>
                            <ChevronRight className="size-2 text-primary md:size-3" />
                        </div>
                    </div>
                    <div className="scrollbar-hidden mt-4 mb-2 flex flex-row gap-2 overflow-x-scroll md:gap-3 lg:gap-4">
                        {categories.map((cat) => (
                            <CategoryCard
                                key={cat.id_category}
                                category={{
                                    id_category: cat.id_category,
                                    src: cat.image,
                                    alt: cat.category_name,
                                    category_name: cat.category_name,
                                    href: `/list_product/${cat.id_category}`,
                                    label: cat.category_name,
                                }}
                            />
                        ))}
                    </div>
                </div>
                {/* bagaian kategori end */}
            </div>
            {/* best choice smartphone section start */}
            <div className="mx-1 mt-3 px-4.5 md:mt-6 lg:mt-9">
                <div className="relative">
                    <div className="flex items-center justify-between align-middle">
                        <h1 className="font-base w-fit border-b-1 border-y-primary py-0.5 text-[10px] text-black md:border-b-2 md:text-[18px] lg:border-b-3 lg:text-[26px]">
                            Pilihan terbaik untuk <span className="font-bold text-primary">Smartphone</span>
                        </h1>
                        <div className="flex cursor-pointer items-center justify-center gap-1 text-center align-middle">
                            <Link href={route('products.list.categories', { id: smartphoneCategory?.id_category })} className="text-[7px] font-medium text-grey1 md:text-[12px] lg:text-[14px]">
                                Lihat Semua
                            </Link>
                            <ChevronRight className="ml-1 size-2 text-primary md:size-3.5" />
                        </div>{' '}
                    </div>
                </div>
                {/* product card */}
                <div className="scrollbar-hidden relative mt-4 mb-2 flex scroll-m-1 flex-row gap-2.5 overflow-x-scroll scroll-smooth lg:mt-6">
                    {products.length > 0 ? (
                        smartphoneProducts?.map((product: ProductItem) => (
                            <ProductCard
                                key={product.id_product}
                                product={{
                                    ...product,
                                    soldCount: product.soldCount ?? 200, // contoh default sementara
                                }}
                                formatPrice={(price) =>
                                    new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        maximumFractionDigits: 0,
                                    }).format(Number(price))
                                }
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-gray-500">Tidak ada produk untuk kategori ini.</p>
                    )}
                </div>
            </div>
            {/* best choice smartphone section end */}

            {/* best choice tablet section start */}
            <div className="mx-1 mt-3 px-4.5 md:mt-6 lg:mt-9">
                <div className="relative">
                    <div className="flex items-center justify-between align-middle">
                        <h1 className="font-base w-fit border-b-1 border-y-primary py-0.5 text-[10px] text-black md:border-b-2 md:text-[18px] lg:border-b-3 lg:text-[26px]">
                            Pilihan terbaik untuk <span className="font-bold text-primary">Tablet</span>
                        </h1>
                        <div className="flex cursor-pointer items-center justify-center gap-1 text-center align-middle">
                            <Link href={route('products.list.categories', { id: tabletCategory?.id_category })} className="text-[7px] font-medium text-grey1 md:text-[12px] lg:text-[14px]">
                                Lihat Semua
                            </Link>
                            <ChevronRight className="ml-1 size-2 text-primary md:size-3.5" />
                        </div>{' '}
                    </div>
                </div>
                {/* product card */}
                <div className="scrollbar-hidden relative mt-4 mb-2 flex scroll-m-1 flex-row gap-2.5 overflow-x-scroll scroll-smooth lg:mt-6">
                    {products.length > 0 ? (
                        tabletProducts?.map((product: ProductItem) => (
                            <ProductCard
                                key={product.id_product}
                                product={{
                                    ...product,
                                    soldCount: product.soldCount ?? 200, // contoh default sementara
                                }}
                                formatPrice={(price) =>
                                    new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        maximumFractionDigits: 0,
                                    }).format(Number(price))
                                }
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-gray-500">Tidak ada produk untuk kategori ini.</p>
                    )}
                </div>
            </div>
            {/* best choice  tablet section end */}

            {/* best choice laptop section start */}
            <div className="mx-1 mt-3 px-4.5 md:mt-6 lg:mt-9">
                <div className="relative">
                    <div className="flex items-center justify-between align-middle">
                        <h1 className="font-base w-fit border-b-1 border-y-primary py-0.5 text-[10px] text-black md:border-b-2 md:text-[18px] lg:border-b-3 lg:text-[26px]">
                            Pilihan terbaik untuk <span className="font-bold text-primary">Laptop</span>
                        </h1>
                        <div className="flex cursor-pointer items-center justify-center gap-1 text-center align-middle">
                            <Link href={route('products.list.categories', { id: laptopCategory?.id_category })} className="text-[7px] font-medium text-grey1 md:text-[12px] lg:text-[14px]">
                                Lihat Semua
                            </Link>
                            <ChevronRight className="ml-1 size-2 text-primary md:size-3.5" />
                        </div>{' '}
                    </div>
                </div>
                {/* product card */}
                <div className="scrollbar-hidden relative mt-4 mb-2 flex scroll-m-1 flex-row gap-2.5 overflow-x-scroll scroll-smooth lg:mt-6">
                    {/* <div className="relative mx-2 mt-4 mb-3 grid grid-cols-2 gap-3.5 lg:mt-6"> */}
                    {/* Dummy data produk */}
                    {products.length > 0 ? (
                        laptopProducts?.map((product: ProductItem) => (
                            <ProductCard
                                key={product.id_product}
                                product={{
                                    ...product,
                                    soldCount: product.soldCount ?? 200, // contoh default sementara
                                }}
                                formatPrice={(price) =>
                                    new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        maximumFractionDigits: 0,
                                    }).format(Number(price))
                                }
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-gray-500">Tidak ada produk untuk kategori ini.</p>
                    )}
                </div>
            </div>

            {/* footer start */}
            <Footer2 />
            {/* footer end */}
        </Layout>
    );
}
