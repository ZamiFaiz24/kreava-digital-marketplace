import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title={t('auth.register_title')} description={t('auth.register_description')}>
            <Head title={t('auth.register')} />
            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-foreground/90 text-sm font-medium">
                            {t('auth.name')}
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.full_name')}
                            className="bg-background/80 h-11 rounded-xl"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-foreground/90 text-sm font-medium">
                            {t('auth.email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                            className="bg-background/80 h-11 rounded-xl"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-foreground/90 text-sm font-medium">
                            {t('auth.password')}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.password')}
                            className="bg-background/80 h-11 rounded-xl"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-foreground/90 text-sm font-medium">
                            {t('auth.confirm_password')}
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.confirm_password')}
                            className="bg-background/80 h-11 rounded-xl"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 h-11 w-full rounded-xl shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                        tabIndex={5}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {t('auth.create_account')}
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    {t('auth.have_account')}{' '}
                    <TextLink href={route('login')} className="text-foreground font-medium" tabIndex={6}>
                        {t('auth.login')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
