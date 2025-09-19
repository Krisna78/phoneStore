import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header2 from '@/components/Header2';

export default function Password() {
  const { auth } = usePage<SharedData>().props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roleNames = auth.user?.roles?.map((r: any) => r.name) || [];
  const isAdmin = roleNames.includes('admin');

  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const { data, setData, errors, put, reset, processing, recentlySuccessful } =
    useForm({
      current_password: '',
      password: '',
      password_confirmation: '',
    });

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  const Content = (
    <>
      <SettingsLayout isAdmin={isAdmin}>
      <HeadingSmall
        title="Update password"
        description="Pastikan akun anda menggunakan kata sandi yang panjang dan acak untuk tetap aman"
      />
      <form onSubmit={updatePassword} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="current_password">Kata sandi saat ini</Label>
          <Input
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="current-password"
            placeholder="Current password"
          />
          <InputError message={errors.current_password} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Kata sandi baru</Label>
          <Input
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
            placeholder="New password"
          />
          <InputError message={errors.password} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">Konfirmasi kata sandi</Label>
          <Input
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) =>
              setData('password_confirmation', e.target.value)
            }
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
            placeholder="Confirm password"
          />
          <InputError message={errors.password_confirmation} />
        </div>

        <div className="flex items-center gap-4">
          <Button disabled={processing} className={isAdmin ? 'bg-black' : 'bg-blue-500 hover:bg-blue-600'}>Save password</Button>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-neutral-600">Saved</p>
          </Transition>
        </div>
      </form>
      </SettingsLayout>
    </>
  );

    return isAdmin ? (
        <AppLayout breadcrumbs={[{ title: 'Password settings', href: '/settings/password' }]}>{Content}</AppLayout>
    ) : (
        <div>
            <Header2 user={auth.user} />
            <main className='mx-auto max-w-3xl px-4 py-8'>{Content}</main>
        </div>
    )
}
