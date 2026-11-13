import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { t } = useTranslation();
    const { url } = usePage<{ url: string }>();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const loginRedirect = new URLSearchParams(url.split('?')[1] || '').get('redirect');

    return (
        <AuthLayout title={t('auth.welcome_back')} description={t('auth.login_description')}>
            <Head title={t('auth.login')} />

            {loginRedirect && (
                <div className="border-border/70 bg-muted/50 text-foreground/75 rounded-2xl border px-4 py-3 text-sm shadow-sm">
                    {t('auth.login_redirect_notice')}
                </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-foreground/90 text-sm font-medium">
                            {t('auth.email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="bg-background/80 h-11 rounded-xl"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-foreground/90 text-sm font-medium">
                                {t('auth.password')}
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="text-muted-foreground hover:text-foreground ml-auto text-sm"
                                    tabIndex={5}
                                >
                                    {t('auth.forgot_password')}
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={t('auth.password')}
                            className="bg-background/80 h-11 rounded-xl"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="border-border/60 bg-muted/30 flex items-center space-x-3 rounded-xl border px-3 py-2">
                        <Checkbox id="remember" name="remember" tabIndex={3} />
                        <Label htmlFor="remember" className="text-foreground/80 text-sm">
                            {t('auth.remember_me')}
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 h-11 w-full rounded-xl shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {t('auth.login')}
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    {t('auth.no_account')}{' '}
                    <TextLink href={route('register')} className="text-foreground font-medium" tabIndex={5}>
                        {t('auth.sign_up')}
                    </TextLink>
                </div>
            </form>

            {status && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
