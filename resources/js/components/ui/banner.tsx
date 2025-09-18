import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function Banner() {
    const banners = [
        { id: 1, image: "/images/rectangle_5.png" },
        { id: 2, image: "/images/banner_2.jpg" },
        { id: 3, image: "/images/rectangle_5.png" },
        { id: 4, image: "/images/banner_2.jpg" },
    ];

    const [index, setIndex] = useState(0); // posisi banner aktif
    const [showControls, setShowControls] = useState(false); // kontrol tampil/hidden
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // fungsi untuk maju & mundur
    const prevSlide = () => {
        setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    };
    // Auto-slide setiap 5 detik
    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, []);

    const startAutoSlide = () => {
        stopAutoSlide();
        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 5000);
    };

    // Kalau tidak ada banner
    const stopAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    if (!banners || banners.length === 0) {
        return <div>Belum ada banner</div>;
    }

    return (
        <div
            className="relative h-[170px] w-full overflow-hidden flex items-center justify-center py-3 pb-7 md:h-[270px] md:py-5 lg:h-[450px] lg:py-8 lg:pb-9"
            onMouseEnter={() => {
                setShowControls(true);// tampilkan tombol saat hover
                stopAutoSlide(); // hentikan auto-slide saat hover
            }}
            onMouseLeave={() => {
                setShowControls(false); // sembunyikan tombol saat keluar hover
                startAutoSlide(); // lanjutkan auto-slide
            }}
        >
            <div className="relative w-full h-full mx-5 justify-center items-center flex lg:mx-10">
                  {/* Tombol Prev */}
                {showControls && (
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 -left-2.5 -translate-y-1/2 rounded-full bg-black/30 p-1.5 md:p-2 lg:p-3 text-white hover:bg-primary transition"
                    >
                        <ChevronLeft className="size-3 md:size-4 lg:size-7" />
                    </button>
                )}
                {/* Gambar Banner */}
                <img
                    src={banners[index].image}
                    alt={`banner-${index}`}
                    className="w-full h-full object-fill rounded-md"
                />
                {/* Tombol Next */}
                {showControls && (
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 -right-2.5 -translate-y-1/2 rounded-full bg-black/30 p-1.5 md:p-2 lg:p-3 text-white hover:bg-primary transition"
                    >
                        <ChevronRight className="size-3 md:size-4 lg:size-7" />
                    </button>
                )}

                <div className="absolute -bottom-5 md:-bottom-5 lg:-bottom-7 left-1/2 flex -translate-x-1/2 gap-2 bg-accent/40 rounded-lg p-1 lg:p-1.5 md:p-1">
                    {banners.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 w-1 md:h-1.5 md:w-1.5 lg:h-2 lg:w-2 rounded-full transition ${
                                i === index ? 'bg-white' : 'bg-grey2'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}