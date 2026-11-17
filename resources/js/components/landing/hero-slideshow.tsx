import { useEffect, useState } from 'react';

const slides = [
    {
        src: '/images/landing/kreava-hero 1.png',
        alt: 'Dashboard marketplace Kreava dengan kategori, produk unggulan, dan aktivitas creator',
    },
    {
        src: '/images/landing/kreava-hero 2.png',
        alt: 'Template landing page, ebook, UI kit, dan ikon produk Kreava',
    },
    {
        src: '/images/landing/kreava-hero 4.png',
        alt: 'Kumpulan ebook, UI kit, dan ikon produk digital Kreava',
    },
    {
        src: '/images/landing/kreava-hero 3.png',
        alt: 'Komponen UI dan template web dalam tampilan isometrik',
    },
];

const SLIDE_DURATION = 5500;

export function HeroSlideshow() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduceMotion(mq.matches);

        const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
        mq.addEventListener('change', onChange);

        return () => mq.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        if (paused || reduceMotion) return;

        const id = window.setInterval(() => {
            setActive((current) => (current + 1) % slides.length);
        }, SLIDE_DURATION);

        return () => window.clearInterval(id);
    }, [paused, reduceMotion]);

    return (
        <div
            className="relative rounded-[2rem] border border-indigo-100 bg-white p-3 shadow-2xl shadow-indigo-100/70"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100">
                {slides.map((slide, index) => (
                    <img
                        key={slide.src}
                        src={slide.src}
                        alt={slide.alt}
                        aria-hidden={index !== active}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                            index === active ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
                {slides.map((slide, index) => (
                    <button
                        key={slide.src}
                        type="button"
                        onClick={() => setActive(index)}
                        aria-label={`Tampilkan gambar ${index + 1}`}
                        aria-current={index === active}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === active ? 'w-6 bg-indigo-600' : 'w-2 bg-indigo-200 hover:bg-indigo-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}