import { Link } from '@inertiajs/react';

type CategoryItem = {
    id_category: number;
    src: string;
    alt: string;
    category_name: string;
    href: string;
    label: string;
};

type Props = {
    category: CategoryItem;
};

export default function CategoryCard({ category }: Props) {
    return (
        <Link href={category.href} className="flex flex-col items-center rounded-lg border border-third3 p-3 transition-all hover:shadow-md">
            {/* Gambar kategori */}
            <div className="flex h-[70px] w-[75px] items-center justify-center group-hover:scale-105 lg:h-[85px] lg:w-[90px]">
                <img
                    src={category.src}
                    alt={category.alt}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* Nama kategori */}
            <h1 className="mt-2 text-[10px] font-medium text-primary lg:text-[13px]">{category.label}</h1>
        </Link>
    );
}
