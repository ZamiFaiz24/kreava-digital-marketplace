import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Loader2, Store } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface SellerSettings {
    store_name: string;
    slug: string;
    description: string | null;
    contact_email: string | null;
    phone: string | null;
    logo: string | null;
    banner: string | null;
}

interface SettingsPageProps {
    seller: SellerSettings;
}

interface SettingsForm {
    [key: string]: string | File | null;
    store_name: string;
    description: string;
    contact_email: string;
    phone: string;
    logo: File | null;
    banner: File | null;
}

export default function SellerSettingsPage({ seller }: SettingsPageProps) {
    const [logoPreview, setLogoPreview] = useState<string | null>(seller.logo);
    const [bannerPreview, setBannerPreview] = useState<string | null>(seller.banner);

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<SettingsForm>({
        store_name: seller.store_name,
        description: seller.description ?? '',
        contact_email: seller.contact_email ?? '',
        phone: seller.phone ?? '',
        logo: null,
        banner: null,
    });

    const handleLogoChange = (file: File | null) => {
        setData('logo', file);
        setLogoPreview(file ? URL.createObjectURL(file) : seller.logo);
    };

    const handleBannerChange = (file: File | null) => {
        setData('banner', file);
        setBannerPreview(file ? URL.createObjectURL(file) : seller.banner);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        patch(route('seller.settings.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Seller Settings" />
            <DashboardLayout>
                <div className="mx-auto max-w-4xl space-y-6">
                    <div>
                        <h1 className="text-foreground text-2xl font-bold">Seller Settings</h1>
                        <p className="text-muted-foreground text-sm">Atur profil toko, branding, dan informasi kontak yang dilihat pembeli.</p>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>Gagal menyimpan pengaturan. Periksa kembali isian formulir.</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="border-border overflow-hidden rounded-xl border bg-white shadow-sm">
                            <div className="from-primary/20 via-primary/10 to-accent/20 relative h-36 bg-gradient-to-r">
                                {bannerPreview ? (
                                    <img src={bannerPreview} alt="Banner toko" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                                        Banner toko belum diatur
                                    </div>
                                )}
                            </div>
                            <div className="space-y-5 p-6">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="border-border bg-muted/40 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo toko" className="h-full w-full object-cover" />
                                        ) : (
                                            <Store className="text-muted-foreground h-6 w-6" />
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="logo">Logo toko</Label>
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => handleLogoChange(event.target.files?.[0] ?? null)}
                                            className="cursor-pointer"
                                        />
                                        <p className="text-muted-foreground text-xs">Format gambar, maksimal 2 MB.</p>
                                        <InputError message={errors.logo} className="text-rose-500" />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="banner">Banner toko</Label>
                                    <Input
                                        id="banner"
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => handleBannerChange(event.target.files?.[0] ?? null)}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-muted-foreground text-xs">Rasio lebar disarankan. Maksimal 4 MB.</p>
                                    <InputError message={errors.banner} className="text-rose-500" />
                                </div>
                            </div>
                        </div>

                        <div className="border-border grid gap-5 rounded-xl border bg-white p-6 shadow-sm md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="store_name">Nama toko</Label>
                                <Input
                                    id="store_name"
                                    value={data.store_name}
                                    onChange={(event) => setData('store_name', event.target.value)}
                                    placeholder="Nama toko kamu"
                                    required
                                />
                                <InputError message={errors.store_name} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="description">Deskripsi toko</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    placeholder="Ceritakan produk dan gaya tokomu."
                                    rows={5}
                                />
                                <InputError message={errors.description} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contact_email">Email kontak</Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(event) => setData('contact_email', event.target.value)}
                                    placeholder="hello@toko.com"
                                />
                                <InputError message={errors.contact_email} className="text-rose-500" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Nomor telepon</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(event) => setData('phone', event.target.value)}
                                    placeholder="08123456789"
                                />
                                <InputError message={errors.phone} className="text-rose-500" />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-3">
                            {recentlySuccessful && <p className="text-sm text-emerald-600">Pengaturan berhasil disimpan.</p>}
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Pengaturan'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
