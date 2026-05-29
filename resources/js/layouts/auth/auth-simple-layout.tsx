import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="bg-background relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-10 md:px-10">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.14),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.04),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.12),_transparent_28%)]" />
            <div className="absolute -left-20 top-20 -z-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-24 bottom-12 -z-10 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

            <div className="w-full max-w-md">
                <div className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-8">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link href={route('landing')} className="flex flex-col items-center gap-2 font-medium transition-opacity hover:opacity-85">
                                <div className="relative h-20 w-52 overflow-hidden">
                                    <img
                                        src="/images/Logo/LogoFull.png"
                                        alt="KREAVA"
                                        className="absolute left-1/2 top-1/2 h-[240px] w-[240px] max-w-none -translate-x-1/2 -translate-y-1/2"
                                    />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                                <p className="text-muted-foreground text-center text-sm leading-6">{description}</p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
