'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product', href: '/product' },
    { title: 'Add Product', href: '/product/add' },
];

const schema = z.object({
    name: z.string().min(1, 'Nama produk wajib diisi'),
    price: z.string().min(1, 'Harga wajib diisi'),
    description: z.string().min(1, 'Deskripsi wajib diisi'),
    merk_id: z.string().min(1, 'Merk wajib dipilih'),
    category_id: z.string().min(1, 'Kategori wajib dipilih'),
    image: z.any().refine((files) => files?.length > 0, 'Gambar wajib ditambahkan'),
});

type FormData = z.infer<typeof schema>;

type MerkType = {
    id_merk: number;
    merk_name: string;
};

type CategoryType = {
    id_category: number;
    category_name: string;
};

export default function AddProductForm() {
    const { merk, category } = usePage().props as unknown as {
        merk: MerkType[];
        category: CategoryType[];
    };

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            price: '',
            description: '',
            merk_id: '',
            category_id: '',
            image: undefined,
        },
    });

    function onSubmit(data: FormData) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('description', data.description);
        formData.append('merk_id', data.merk_id);
        formData.append('category_id', data.category_id);

        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }

        router.post('/product/store', formData, {
            onSuccess: () => {
                toast.success('Produk berhasil ditambahkan!');
                form.reset();
            },
            onError: () => {
                toast.error('Gagal menambahkan produk. Coba lagi.');
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Product" />
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-6 md:min-h-min dark:border-sidebar-border">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-md border p-2 md:p-5"
                        encType="multipart/form-data"
                    >
                        <h2 className="text-2xl font-bold">Tambah Produk</h2>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Produk</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Masukkan nama produk" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Nominal produk" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Masukkan deskripsi produk anda" className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="merk_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Merk</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Merk" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {merk.map((m) => (
                                                <SelectItem key={m.id_merk} value={m.id_merk.toString()}>
                                                    {m.merk_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kategori Produk" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {category.map((c) => (
                                                <SelectItem key={c.id_category} value={c.id_category.toString()}>
                                                    {c.category_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gambar Produk</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files as FileList)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex w-full items-center justify-end pt-3">
                            <Button className="rounded-lg" size="sm" type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Menambahkan...' : 'Tambah'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
