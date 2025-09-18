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
    originalPrice: number;
    discount: number;
    image: string;
};

type HomepageProps = {
    user: { name: string } | null;
    categories: CategoryItem[];
    banners: string[];
    productsByCategory: Record<string, ProductItem[]>;
};

export default function Homepage2({ user, categories, productsByCategory, banners }: HomepageProps) {
    const cartCount = usePage().props.cartCount as number;
    const { auth } = usePage().props as { auth: { user: { name: string } | null } };

    return (
        <Layout>
            <Head title="PhoneStore - Belanja Gadget Terbaik" />

            {/* header start */}
            <Header2 user={auth.user} cartItemCount={cartCount} />
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
                            <Link href={route('homepage')} className="text-grey1 text-[7px] font-medium md:text-[12px] lg:text-[14px]">
                                Lihat Semua
                            </Link>
                            <ChevronRight className="size-2 text-primary md:size-3" />
                        </div>{' '}
                    </div>
                    <div className="scrollbar-hidden mt-4 mb-2 flex flex-row gap-2 overflow-x-scroll md:gap-3 lg:gap-4">
                        {[
                            {
                                src: '/images/tab-kategori/hp.png',
                                alt: 'kategori-smartphone',
                                label: 'Smartphone',
                                href: '/list_product/{id_category}',
                                padding: 'p-0 ',
                            },
                            {
                                src: '/images/tab-kategori/tablet2.png',
                                alt: 'kategori-tablet',
                                label: 'Tablet',
                                href: '/list_product/{id_category}',
                                padding: 'p-0',
                            },
                            {
                                src: '/images/tab-kategori/laptop.png',
                                alt: 'kategori-laptop',
                                label: 'Laptop',
                                href: '/list_product/{id_category}',
                                padding: 'p-0',
                            },
                            {
                                src: '/images/tab-kategori/tws.png',
                                alt: 'kategori-aksesoris',
                                label: 'Aksesoris',
                                href: '/list_product/{id_category}',
                                padding: 'p-0',
                            },
                        ].map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="4 border-third3 flex h-fit w-fit flex-col items-center justify-center rounded-lg border-1 p-2 text-center align-middle md:p-3 lg:p-6"
                            >
                                <div className="flex size-[70px] items-center justify-center lg:size-[85px]">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className={`h-[60px] w-[70px] object-contain md:h-[70px] md:w-[75px] lg:h-[80px] lg:w-[85px] ${item.padding}`}
                                    />
                                </div>
                                <h1 className="mt-2 text-[9px] font-medium text-primary md:text-[10px] lg:mt-4 lg:text-[13px]">{item.label}</h1>
                            </Link>
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
                            <Link href={route('homepage')} className="text-grey1 text-[7px] font-medium md:text-[12px] lg:text-[14px]">
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
                    {[
                        {
                            src: '/images/produk/hp2.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },
                        {
                            src: '/images/produk/hp3.PNG',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },
                        {
                            src: '/images/produk/hp2.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },
                        {
                            src: '/images/produk/hp3.PNG',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },

                        // Tambahkan produk lainnya sesuai kebutuhan
                    ].map((foto_produk, idx) => (
                        <div className="border-grey2 relative h-fit w-fit rounded-md border-1 bg-white">
                            <div key={idx} className="bg-grey5 rounded-t-md p-2 shadow-md">
                                <div className="mt-3 h-[100px] w-[95px] md:h-[110px] md:w-[120px] lg:h-[150px] lg:w-[160px]">
                                    {/* masuk ke halam detail produk */}
                                    <Link href={foto_produk.href}>
                                        <div className="flex h-full w-full items-center justify-center object-contain p-0.5 text-center align-middle">
                                            <img
                                                src={foto_produk.src}
                                                alt={foto_produk.alt}
                                                className="h-full w-fit object-contain" // Pastikan gambar mengisi seluruh area div
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-start justify-start p-2 text-left text-wrap">
                                {[
                                    {
                                        h1: 'Infinix Smart 10 Plus 8/128GB - Black',
                                        price: 'Rp. 2.500.000',
                                        discount: 'Rp. 2.800.000',
                                    },
                                ].map((produk, idx) => (
                                    <Link key={idx} href={'produk.href'}>
                                        <div className="flex h-fit w-[100px] flex-col gap-1.5 py-1.5 text-[10px] md:w-[120px] md:text-[11.5px] lg:w-[160px]">
                                            {/* Menggunakan text-sm dan whitespace-normal untuk memecah kata jika terlalu panjang */}
                                            <h1 className="font-normal break-words whitespace-normal text-black">{produk.h1}</h1>
                                            {/* Judul produk, whitespace-normal akan membuat teks turun ke baris baru jika terlalu panjang */}
                                            <div className="mt-1.5 grid grid-cols-2 items-center gap-1.5">
                                                {/* Harga produk */}
                                                <p className="w-[70px] text-[10px] font-semibold text-primary lg:w-[100px] lg:text-[15px]">
                                                    {produk.price}
                                                </p>
                                                {/* Discount badge */}
                                                <p className="ml-auto w-fit items-center justify-center rounded-md border-1 border-amber-200 bg-amber-500 px-1 py-0.5 align-middle text-[8px] text-white lg:px-2 lg:text-[10px]">
                                                    30 %
                                                </p>
                                            </div>
                                            <span className="text-grey1 lg:text-[12px]">200 Terjual</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
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
                            <Link href={route('homepage')} className="text-grey1 text-[7px] font-medium md:text-[12px] lg:text-[14px]">
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
                    {[
                        {
                            src: '/images/produk/tab.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },
                        {
                            src: '/images/tab-kategori/tablet.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },
                        {
                            src: '/images/tab-kategori/tablet2.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },
                        {
                            src: '/images/tab-kategori/tablet2.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },

                        // Tambahkan produk lainnya sesuai kebutuhan
                    ].map((foto_produk, idx) => (
                        <div className="border-grey2 relative h-fit w-fit rounded-md border-1 bg-white">
                            <div key={idx} className="bg-grey5 rounded-t-md p-2 shadow-md">
                                <div className="mt-3 h-[100px] w-[95px] md:h-[110px] md:w-[120px] lg:h-[150px] lg:w-[160px]">
                                    {/* masuk ke halam detail produk */}
                                    <Link href={foto_produk.href}>
                                        <div className="flex h-full w-full items-center justify-center object-contain p-0.5 text-center align-middle">
                                            <img
                                                src={foto_produk.src}
                                                alt={foto_produk.alt}
                                                className="h-full w-fit object-contain" // Pastikan gambar mengisi seluruh area div
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-start justify-start p-2 text-left text-wrap">
                                {[
                                    {
                                        h1: 'Infinix Smart 10 Plus 8/128GB - Black',
                                        price: 'Rp. 2.500.000',
                                        discount: 'Rp. 2.800.000',
                                    },
                                ].map((produk, idx) => (
                                    <Link key={idx} href={'produk.href'}>
                                        <div className="flex h-fit w-[100px] flex-col gap-1.5 py-1.5 text-[10px] md:w-[120px] md:text-[11.5px] lg:w-[160px]">
                                            {/* Menggunakan text-sm dan whitespace-normal untuk memecah kata jika terlalu panjang */}
                                            <h1 className="font-normal break-words whitespace-normal text-black">{produk.h1}</h1>
                                            {/* Judul produk, whitespace-normal akan membuat teks turun ke baris baru jika terlalu panjang */}
                                            <div className="mt-1.5 grid grid-cols-2 items-center gap-1.5">
                                                {/* Harga produk */}
                                                <p className="w-[70px] text-[10px] font-semibold text-primary lg:w-[100px] lg:text-[15px]">
                                                    {produk.price}
                                                </p>
                                                {/* Discount badge */}
                                                <p className="ml-auto w-fit items-center justify-center rounded-md border-1 border-amber-200 bg-amber-500 px-1 py-0.5 align-middle text-[8px] text-white lg:px-2 lg:text-[10px]">
                                                    30 %
                                                </p>
                                            </div>
                                            <span className="text-grey1 lg:text-[12px]">200 Terjual</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
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
                            <Link href={route('homepage')} className="text-grey1 text-[7px] font-medium md:text-[12px] lg:text-[14px]">
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
                    {[
                        {
                            src: '/images/produk/laptop.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },
                        {
                            src: '/images/tab-kategori/laptop.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },
                        {
                            src: '/images/produk/laptop.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },
                        {
                            src: '/images/tab-kategori/laptop.png',
                            alt: 'kategori-tablet',
                            href: '/kategori/tablet',
                        },

                        // Tambahkan produk lainnya sesuai kebutuhan
                    ].map((foto_produk, idx) => (
                        <div className="border-grey2 relative h-fit w-fit rounded-md border-1 bg-white">
                            <div key={idx} className="bg-grey5 rounded-t-md p-2 shadow-md">
                                <div className="mt-3 h-[100px] w-[95px] md:h-[110px] md:w-[120px] lg:h-[150px] lg:w-[160px]">
                                    {/* masuk ke halam detail produk */}
                                    <Link href={foto_produk.href}>
                                        <div className="flex h-full w-full items-center justify-center object-contain p-0.5 text-center align-middle">
                                            <img
                                                src={foto_produk.src}
                                                alt={foto_produk.alt}
                                                className="h-full w-fit object-contain" // Pastikan gambar mengisi seluruh area div
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-start justify-start p-2 text-left text-wrap">
                                {[
                                    {
                                        h1: 'Infinix Smart 10 Plus 8/128GB - Black',
                                        price: 'Rp. 2.500.000',
                                        discount: 'Rp. 2.800.000',
                                    },
                                ].map((produk, idx) => (
                                    <Link key={idx} href={'produk.href'}>
                                        <div className="flex h-fit w-[100px] flex-col gap-1.5 py-1.5 text-[10px] md:w-[120px] md:text-[11.5px] lg:w-[160px]">
                                            {/* Menggunakan text-sm dan whitespace-normal untuk memecah kata jika terlalu panjang */}
                                            <h1 className="font-normal break-words whitespace-normal text-black">{produk.h1}</h1>
                                            {/* Judul produk, whitespace-normal akan membuat teks turun ke baris baru jika terlalu panjang */}
                                            <div className="mt-1.5 grid grid-cols-2 items-center gap-1.5">
                                                {/* Harga produk */}
                                                <p className="w-[70px] text-[10px] font-semibold text-primary lg:w-[100px] lg:text-[15px]">
                                                    {produk.price}
                                                </p>
                                                {/* Discount badge */}
                                                <p className="ml-auto w-fit items-center justify-center rounded-md border-1 border-amber-200 bg-amber-500 px-1 py-0.5 align-middle text-[8px] text-white lg:px-2 lg:text-[10px]">
                                                    30 %
                                                </p>
                                            </div>
                                            <span className="text-grey1 lg:text-[12px]">200 Terjual</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* best choice laptop section end */}

            {/* best choice from brand section start */}
            {/* <div className="px-4.5 mx-1 mt-3 md:mt-6 lg:mt-9">
                <div className="relative">
                    <div className="flex items-center justify-between align-middle">
                        <h1 className="font-base border-b-1 border-y-primary w-fit py-0.5 text-[10px] text-black md:border-b-2 md:text-[18px] lg:text-[22px]">
                            Pilihan terbaik untuk <span className="text-primary font-bold">Brand</span>
                        </h1>
                        <div className="flex cursor-pointer items-center justify-center gap-1 text-center align-middle">
                            <Link href={route('homepage')} className="text-grey1 text-[7px] font-medium md:text-[12px]">
                                Lihat Semua
                            </Link>
                            <ChevronRight className="text-primary ml-1 size-2 md:size-3.5" />
                        </div>{' '}
                    </div>
                </div>
                <div className="mb-2 mt-3 grid grid-cols-2 justify-between justify-items-stretch gap-2 md:mt-5 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
                    {[
                        { src: '/images/brand/samsung.png', alt: 'brand-samsung', href: '/kategori/samsung' },
                        { src: '/images/brand/oppo.png', alt: 'brand-samsung', href: '/kategori/samsung' },
                        { src: '/images/brand/Iphone.png', alt: 'brand-samsung', href: '/kategori/samsung' },
                        { src: '/images/brand/vivo.png', alt: 'brand-samsung', href: '/kategori/samsung' },
                        { src: '/images/brand/samsung.png', alt: 'brand-samsung', href: '/kategori/samsung' },
                        { src: '/images/brand/oppo.png', alt: 'brand-samsung', href: '/kategori/samsung' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="border-1 border-primary flex h-[60px] w-full cursor-pointer items-center justify-center rounded-md object-contain p-2 md:h-[80px] lg:h-[120px]"
                        >
                            <img src={item.src} alt={item.alt} />
                        </div>
                    ))}
                </div>
            </div> */}
            {/* best choice from brand section end */}

            {/* footer start */}
            <Footer2 />
            {/* footer end */}
        </Layout>
    );
}
