'use client';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

import { AddProductModal } from '@/components/modal/add-product-modal';
import EditProductModal from '@/components/modal/edit-product-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DeleteProductAlertDialog } from '@/components/ui/DeleteProductAlertDialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: '/product',
    },
];

type Merk = {
    id_merk: number;
    merk_name: string;
};

type Category = {
    id_category: number;
    category_name: string;
};

export type ProductType = {
    id_product: string;
    name: string;
    description: string;
    price: number;
    image: string;
    merk?: Merk;
    category?: Category;
};

interface ProductTableProps {
    products: ProductType[];
    merk: { id_merk: number; merk_name: string }[];
    category: { id_category: number; category_name: string }[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ProductTable({ products: initialProducts, merk, category, flash }: ProductTableProps) {
    const [products, setProducts] = React.useState(initialProducts);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const columns: ColumnDef<ProductType>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'image',
            header: 'Image',
            cell: ({ row }) => {
                const image = row.original.image;
                return (
                    <img
                        src={image.startsWith('http') ? image : `/storage/${image}`}
                        alt={row.original.name}
                        className="h-16 w-16 rounded-md object-cover"
                    />
                );
            },
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => <div className="line-clamp-2 max-w-2xs overflow-ellipsis">{row.getValue('description')}</div>,
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: ({ row }) => <div className="font-medium">Rp {Number(row.getValue('price')).toLocaleString('id-ID')}</div>,
        },
        {
            id: 'merk_id',
            header: 'Merk',
            cell: ({ row }) => row.original.merk?.merk_name ?? '-',
        },
        {
            id: 'category_id',
            header: 'Category',
            cell: ({ row }) => row.original.category?.category_name ?? '-',
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <EditProductModal
                        product={row.original}
                        merk={merk}
                        category={category}
                        onSuccess={(updated) => {
                            // update local state tanpa reload seluruh halaman
                            setProducts((prev) => prev.map((p) => (String(p.id_product) === String(updated.id_product) ? updated : p)));
                            toast.success('Produk berhasil diperbarui!');
                        }}
                    />
                    <DeleteProductAlertDialog
                        id={row.original.id_product}
                        onDelete={(id) => {
                            router.delete(`/product/${id}`, {
                                onSuccess: () => {
                                    setProducts((prev) => prev.filter((p) => String(p.id_product) !== String(id)));
                                },
                                onError: (err) => {
                                    console.error('Delete error', err);
                                    toast.error('Gagal menghapus produk');
                                },
                            });
                        }}
                    />
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: products,
        columns,
        state: {
            sorting,
            globalFilter,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        globalFilterFn: (row, columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            const name = row.original.name?.toLowerCase() ?? '';
            const category = row.original.category?.category_name?.toLowerCase() ?? '';
            const merk = row.original.merk?.merk_name?.toLowerCase() ?? '';
            return name.includes(search) || category.includes(search) || merk.includes(search);
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product" />
            <div className="p-4">
                <h1 className="mb-2 text-2xl font-bold">Daftar Produk</h1>
                <div className="flex items-center gap-2 py-4">
                    <Input
                        placeholder="Cari produk, kategori, atau merk..."
                        value={globalFilter ?? ''}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                    <div className="ml-auto flex gap-2">
                        <AddProductModal
                            merk={merk}
                            category={category}
                            onSuccess={() => {
                                toast.success('Produk berhasil ditambahkan!');
                            }}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Columns <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
