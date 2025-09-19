'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const schema = z.object({
    name: z.string().min(2, 'Nama produk minimal 2 karakter').max(100),
    price: z.string().min(1, 'Harga wajib diisi').max(100),
    description: z.string().min(1, 'Deskripsi wajib diisi').max(1000),
    merk_id: z.string().min(1, 'Merk wajib dipilih'),
    category_id: z.string().min(1, 'Kategori wajib dipilih'),
    image: z
        .any()
        .refine((files) => {
            if (files?.length > 0) return true;
            return !!product?.image;
        }, 'Gambar wajib ditambahkan')
        .optional(),
});

type FormData = z.infer<typeof schema>;

type ProductType = {
    id_product: string;
    name: string;
    price: number;
    description: string;
    image: string;
    merk?: { id_merk: number; merk_name: string };
    category?: { id_category: number; category_name: string };
};

interface EditProductModalProps {
    product: ProductType;
    merk: { id_merk: number; merk_name: string }[];
    category: { id_category: number; category_name: string }[];
    onSuccess?: (updatedProduct: ProductType) => void;
    trigger?: React.ReactNode;
}

export default function EditProductModal({ product, merk, category, onSuccess, trigger }: EditProductModalProps) {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            merk_id: product.merk?.id_merk.toString() ?? '',
            category_id: product.category?.id_category.toString() ?? '',
        },
    });

    function onSubmit(data: FormData) {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('description', data.description);
        formData.append('merk_id', data.merk_id);
        formData.append('category_id', data.category_id);
        formData.append('_method', 'POST');

        if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
        }

        router.post(`/product/${product.id_product}/update`, formData, {
            preserveState: true,
            onSuccess: (page) => {
                setOpen(false);
                setIsLoading(false);
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const updatedProduct = (page.props as any)?.products?.find(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (p: any) => String(p.id_product) === String(product.id_product),
                    );
                    if (onSuccess && updatedProduct) {
                        onSuccess(updatedProduct);
                    } else {
                        router.reload({ only: ['products'] });
                    }
                } catch (e) {
                    router.reload({ only: ['products'] });
                }
            },
            onError: (errors) => {
                if (errors.name) {
                    toast.error(errors.name);
                } else {
                    toast.error('Gagal mengupdate produk.');
                }
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Produk</DialogTitle>
                    <DialogDescription>Edit informasi produk {product.name}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4" encType="multipart/form-data">
                        {/* Nama Produk */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Produk</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Harga */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Deskripsi */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Merk */}
                        <FormField
                            control={form.control}
                            name="merk_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Merk</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Merk" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Array.isArray(merk) ? (
                                                merk.map((m) => (
                                                    <SelectItem key={m.id_merk} value={m.id_merk.toString()}>
                                                        {m.merk_name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-red-500">Merk tidak tersedia</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Kategori */}
                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kategori" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Array.isArray(category) ? (
                                                category.map((c) => (
                                                    <SelectItem key={c.id_category} value={c.id_category.toString()}>
                                                        {c.category_name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-red-500">Kategori tidak tersedia</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Upload Gambar */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Gambar Produk</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} />
                                    </FormControl>
                                    {product.image && (
                                        <div className="mt-2">
                                            <p className="mb-1 text-sm text-muted-foreground">Gambar saat ini:</p>
                                            <img
                                                src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`}
                                                alt={product.name}
                                                className="h-20 w-20 rounded border object-cover"
                                            />
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
