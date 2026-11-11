import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Eye, EyeOff, ImagePlus, Loader2, Save, Trash2 } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';
import DashboardLayout from '../../../components/seller/layout/dashboard-layout';

interface CategoryOption {
    id: number;
    name: string;
}

interface EditableProduct {
    id: number;
    title: string;
    slug: string;
    description: string;
    category_id: number;
    price: number;
    thumbnail: string | null;
    preview_link: string;
    status: 'published' | 'draft' | 'rejected' | 'pending';
}

interface EditProductPageProps {
    product: EditableProduct;
    categories: CategoryOption[];
    can_delete: boolean;
}

interface ProductEditForm {
    [key: string]: string | File | null | undefined;
    title: string;
    slug: string;
    description: string;
    category_id: string;
    price: string;
    thumbnail: File | null;
    preview_link: string;
    status?: 'published' | 'draft';
    _method?: 'put';
}

const statusStyles: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-slate-100 text-slate-700',
    rejected: 'bg-rose-100 text-rose-700',
    pending: 'bg-amber-100 text-amber-700',
};

export default function EditProductPage({ product, categories, can_delete }: EditProductPageProps) {
    const statusRef = useRef<'published' | 'draft' | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(product.thumbnail);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm<ProductEditForm>({
        title: product.title,
        slug: product.slug,
        description: product.description,
        category_id: String(product.category_id),
        price: String(product.price),
        thumbnail: null,
        preview_link: product.preview_link,
    });

    transform((formData) => ({
        ...formData,
        _method: 'put',
        ...(statusRef.current ? { status: statusRef.current } : {}),
    }));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        statusRef.current = null;

        post(route('seller.products.update', product.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const changeStatus = (status: 'published' | 'draft') => {
        statusRef.current = status;

        post(route('seller.products.update', product.id), {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                statusRef.current = null;
            },
        });
    };

    const destroy = () => {
        if (!window.confirm('Hapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
            return;
        }

        router.delete(route('seller.products.destroy', product.id), {
            preserveScroll: true,
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    const handleThumbnailChange = (file: File | null) => {
        setData('thumbnail', file);
        setThumbnailPreview(file ? URL.createObjectURL(file) : product.thumbnail);
    };

    const isPublished = product.status === 'published';

    return (
        <>
            <Head title="Edit Product" />
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
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-foreground text-2xl font-bold tracking-tight">Edit Product</h1>
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    statusStyles[product.status] ?? 'bg-muted text-foreground/80'
                                }`}
                            >
                                {product.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">Perbarui informasi produk, publikasi, atau hapus produk.</p>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <div>
                                <p className="font-medium">Gagal menyimpan produk.</p>
                                <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <li key={field}>{message}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {!can_delete && (
                        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">
                            Produk ini sudah pernah dibeli. Hapus dinonaktifkan; gunakan Unpublish untuk menyembunyikannya dari marketplace.
                        </div>
                    )}

                    <form onSubmit={submit} className="border-border space-y-6 rounded-xl border bg-white p-6 shadow-sm">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="title">Judul produk</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
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
                                    onChange={(event) => setData('slug', event.target.value)}
                                    placeholder="minimal-ui-kit-for-saas"
                                    required
                                />
                                <p className="text-muted-foreground text-xs">Dipakai pada URL produk.</p>
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
                                <p className="text-muted-foreground text-xs">Biarkan kosong jika tidak ingin mengganti thumbnail.</p>
                                <InputError message={errors.thumbnail} className="text-rose-500" />
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
                        </div>

                        <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Button type="button" variant="outline" asChild disabled={processing}>
                                    <Link href={route('seller.products')}>Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                {isPublished ? (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="bg-rose-500 text-white hover:bg-rose-600"
                                        onClick={() => changeStatus('draft')}
                                        disabled={processing}
                                    >
                                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
                                        Unpublish
                                    </Button>
                                ) : (
                                    <Button type="button" onClick={() => changeStatus('published')} disabled={processing}>
                                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                                        Publish
                                    </Button>
                                )}
                            </div>

                            {can_delete && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="bg-rose-500 text-white hover:bg-rose-600"
                                    onClick={destroy}
                                    disabled={processing || isDeleting}
                                >
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
