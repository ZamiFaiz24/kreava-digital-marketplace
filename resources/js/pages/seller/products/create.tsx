import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, ImagePlus, Loader2, UploadCloud } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import DashboardLayout from '../../../components/seller/layout/dashboard-layout';

interface CategoryOption {
    id: number;
    name: string;
}

interface ProductForm {
    [key: string]: string | File | null;
    title: string;
    slug: string;
    description: string;
    category_id: string;
    price: string;
    thumbnail: File | null;
    file: File | null;
    preview_link: string;
    status: 'published' | 'draft';
}

interface CreateProductPageProps {
    categories: CategoryOption[];
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function CreateProductPage({ categories }: CreateProductPageProps) {
    const [slugTouched, setSlugTouched] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const { data, setData, post, progress, processing, errors } = useForm<ProductForm>({
        title: '',
        slug: '',
        description: '',
        category_id: '',
        price: '',
        thumbnail: null,
        file: null,
        preview_link: '',
        status: 'published',
    });

    const handleTitleChange = (value: string) => {
        setData('title', value);

        if (!slugTouched) {
            setData('slug', slugify(value));
        }
    };

    const handleThumbnailChange = (file: File | null) => {
        setData('thumbnail', file);
        setThumbnailPreview(file ? URL.createObjectURL(file) : null);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post(route('seller.products.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Upload Product" />
            <DashboardLayout>
                <div className="mx-auto max-w-4xl space-y-6">
                    <div>
                        <Link
                            href={route('seller.products')}
                            className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke produk
                        </Link>
                        <h1 className="text-foreground mt-4 text-2xl font-bold tracking-tight">Upload Product</h1>
                        <p className="text-muted-foreground text-sm">
                            Tambahkan produk digital baru. Produk yang dipublikasikan langsung tayang di marketplace.
                        </p>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>Gagal menyimpan produk. Periksa kembali isian formulir.</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="border-border space-y-6 rounded-xl border bg-white p-6 shadow-sm">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="title">Judul produk</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(event) => handleTitleChange(event.target.value)}
                                    placeholder="Misalnya: Minimal UI Kit for SaaS"
                                    required
                                />
                                <InputError message={errors.title} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(event) => {
                                        setSlugTouched(true);
                                        setData('slug', slugify(event.target.value));
                                    }}
                                    placeholder="minimal-ui-kit-for-saas"
                                    required
                                />
                                <p className="text-muted-foreground text-xs">Dipakai pada URL produk. Otomatis dibuat dari judul.</p>
                                <InputError message={errors.slug} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    placeholder="Jelaskan isi produk, fitur, dan apa yang didapat pembeli."
                                    rows={6}
                                />
                                <InputError message={errors.description} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Kategori</Label>
                                <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                    <SelectTrigger id="category_id" className="w-full">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price">Harga (USD)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(event) => setData('price', event.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                                <InputError message={errors.price} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <div className="flex items-center gap-3">
                                    <div className="border-border bg-muted/40 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border">
                                        {thumbnailPreview ? (
                                            <img src={thumbnailPreview} alt="Pratinjau thumbnail" className="h-full w-full object-cover" />
                                        ) : (
                                            <ImagePlus className="text-muted-foreground h-5 w-5" />
                                        )}
                                    </div>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => handleThumbnailChange(event.target.files?.[0] ?? null)}
                                        className="cursor-pointer"
                                    />
                                </div>
                                <InputError message={errors.thumbnail} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="file">File digital</Label>
                                <div className="relative">
                                    <UploadCloud className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="file"
                                        type="file"
                                        onChange={(event) => setData('file', event.target.files?.[0] ?? null)}
                                        className="cursor-pointer pl-9"
                                        required
                                    />
                                </div>
                                <p className="text-muted-foreground text-xs">ZIP, PDF, atau file produk lain. Maksimal 50 MB.</p>
                                <InputError message={errors.file} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="preview_link">Preview link (opsional)</Label>
                                <Input
                                    id="preview_link"
                                    type="url"
                                    value={data.preview_link}
                                    onChange={(event) => setData('preview_link', event.target.value)}
                                    placeholder="https://example.com/preview"
                                />
                                <InputError message={errors.preview_link} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value as ProductForm['status'])}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-muted-foreground text-xs">Produk published langsung tayang tanpa moderasi.</p>
                                <InputError message={errors.status} className="text-rose-500" />
                            </div>
                        </div>

                        {progress && (
                            <div className="space-y-1">
                                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progress.percentage}%` }} />
                                </div>
                                <p className="text-muted-foreground text-xs">Mengunggah... {progress.percentage}%</p>
                            </div>
                        )}

                        <div className="border-border flex flex-wrap items-center justify-end gap-3 border-t pt-4">
                            <Button type="button" variant="outline" asChild disabled={processing}>
                                <Link href={route('seller.products')}>Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Produk'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
