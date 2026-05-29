import { PublicLayout } from '@/components/layout/public-layout';
import { PageProps } from '@/types';
import { Download, FileDown } from 'lucide-react';

interface Download {
    id: number;
    created_at: string;
    product: {
        id: number;
        name: string;
        slug: string;
    };
}

interface Props extends PageProps {
    downloads: {
        data: Download[];
        links: any;
    };
}

export default function Downloads({ downloads }: Props) {
    return (
        <PublicLayout title="My Downloads">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Downloads</h1>
                    <p className="mt-2 text-foreground/60">Access all your purchased files and resources</p>
                </div>

                {downloads.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 py-12">
                        <Download className="mb-4 h-12 w-12 text-foreground/40" />
                        <h3 className="text-lg font-semibold text-foreground">No downloads yet</h3>
                        <p className="mt-1 text-sm text-foreground/60">You haven't purchased any products yet</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {downloads.data.map((download) => (
                            <div
                                key={download.id}
                                className="group relative rounded-lg border border-border bg-card p-6 transition hover:border-primary/30 hover:bg-card/50"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground">{download.product.name}</h3>
                                        <p className="text-xs text-foreground/60">{new Date(download.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <FileDown className="h-5 w-5 text-foreground/40 transition group-hover:text-primary" />
                                </div>

                                <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
