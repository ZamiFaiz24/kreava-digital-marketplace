import { Quote, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import type { LandingTestimonial } from '@/types/landing';

const fallbackTestimonialDefinitions = [
    {
        name: 'Sarah Chen',
        role: 'UI/UX Designer',
        contentKey: 'landing.testimonials.items.sarah',
        avatar: '👩‍💼',
        rating: 5,
    },
    {
        name: 'Marcus Johnson',
        role: 'Full Stack Developer',
        contentKey: 'landing.testimonials.items.marcus',
        avatar: '👨‍💻',
        rating: 5,
    },
    {
        name: 'Elena Rodriguez',
        role: 'Illustration Artist',
        contentKey: 'landing.testimonials.items.elena',
        avatar: '👩‍🎨',
        rating: 5,
    },
    {
        name: 'James Wilson',
        role: 'Content Creator',
        contentKey: 'landing.testimonials.items.james',
        avatar: '👨‍🏫',
        rating: 5,
    },
    {
        name: 'Lisa Park',
        role: 'Design System Lead',
        contentKey: 'landing.testimonials.items.lisa',
        avatar: '👩‍💼',
        rating: 5,
    },
    {
        name: 'Tom Bradley',
        role: 'SaaS Founder',
        contentKey: 'landing.testimonials.items.tom',
        avatar: '👨‍💼',
        rating: 5,
    },
];

function isImageAvatar(avatar?: string | null): boolean {
    if (!avatar) {
        return false;
    }

    return avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(avatar);
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

export function Testimonials({ testimonials }: { testimonials?: LandingTestimonial[] }) {
    const { t } = useTranslation();
    const fallbackTestimonials: LandingTestimonial[] = fallbackTestimonialDefinitions.map(({ contentKey, ...testimonial }) => ({
        ...testimonial,
        content: t(contentKey),
    }));
    const visibleTestimonials = testimonials ?? fallbackTestimonials;

    return (
        <section className="relative bg-white py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
                    <p className="mb-3 text-sm font-semibold tracking-[0.24em] text-rose-500 uppercase">{t('landing.testimonials.eyebrow')}</p>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{t('landing.testimonials.title')}</h2>
                    <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">{t('landing.testimonials.subtitle')}</p>
                </div>

                {visibleTestimonials.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {visibleTestimonials.map((testimonial, index) => {
                            const imageAvatar = isImageAvatar(testimonial.avatar);
                            const fallback =
                                testimonial.avatar && testimonial.avatar.length <= 4 ? testimonial.avatar : getInitials(testimonial.name);

                            return (
                                <Card
                                    key={`${testimonial.name}-${index}`}
                                    className="group relative border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl"
                                >
                                    <Quote className="absolute top-5 right-5 h-8 w-8 text-rose-100 transition group-hover:text-rose-200" />

                                    <div className="relative z-10 flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                            />
                                        ))}
                                    </div>

                                    <p className="relative z-10 mt-4 min-h-20 text-sm leading-7 text-slate-600">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>

                                    <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                                        <Avatar className="h-11 w-11 border border-slate-200">
                                            {imageAvatar && <AvatarImage src={testimonial.avatar as string} alt={testimonial.name} />}
                                            <AvatarFallback className="bg-indigo-50 text-sm font-semibold text-indigo-700">{fallback}</AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900">{testimonial.name}</p>
                                            <p className="truncate text-xs text-slate-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                            <Quote className="h-7 w-7" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{t('landing.testimonials.empty_title')}</h3>
                        <p className="mt-2 max-w-md text-sm text-slate-500">{t('landing.testimonials.empty_description')}</p>
                    </Card>
                )}
            </div>
        </section>
    );
}
