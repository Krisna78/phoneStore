'use client';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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

import InvoiceDetailDialog from '@/components/modal/detail-invoice-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Invoice', href: '/invoice' }];

export type InvoiceType = {
    id_invoice: number;
    invoice_date: string;
    status: 'Menunggu Pembayaran' | 'Batal' | 'Pending' | 'Sudah dibayar';
    checkout_link: string;
    external_id: string;
    payment_amount: number;
    payment_date: string | null;
    user?: { id: string; name: string; email: string };
    created_at: string;
    updated_at: string;
};

interface InvoiceTableProps {
    invoices: InvoiceType[];
    flash?: { success?: string; error?: string };
}

export default function InvoiceTable({ invoices: initialInvoices, flash }: InvoiceTableProps) {
    const mappedInvoices: InvoiceType[] = initialInvoices.map((item: any) => ({
        id_invoice: item.id_invoice,
        invoice_date: item.invoice_date,
        status: item.status,
        checkout_link: item.checkout_link,
        external_id: item.external_id,
        payment_amount: Number(item.line_total || item.payment_amount || 0),
        payment_date: item.payment_date,
        user: {
            id: item.user?.id_user,
            name: item.user?.name,
            email: item.user?.email,
        },
        created_at: item.created_at,
        updated_at: item.updated_at,
        items: (item.invoice_detail ?? []).map((detail: any) => ({
            id_detail: detail.id_detail_invoice,
            quantity: detail.quantity,
            line_total: Number(detail.line_total ?? 0),
            product: detail.product
                ? {
                      id_product: detail.product.id_product,
                      name: detail.product.name,
                      price: Number(detail.product.price),
                      brand: detail.product.brand ?? null,
                      image: detail.product.image ?? null,
                  }
                : null,
        })),
    }));

    const [invoices] = React.useState<InvoiceType[]>(mappedInvoices);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    React.useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const columns: ColumnDef<InvoiceType>[] = [
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
            accessorKey: 'id_invoice',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    ID Invoice <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'invoice_date',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Tanggal Invoice <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const raw = row.getValue('invoice_date') as string;
                return raw ? new Date(raw).toLocaleDateString('id-ID') : '-';
            },
        },
        {
            accessorKey: 'user',
            header: 'Nama User',
            cell: ({ row }) => {
                return row.original.user?.name ?? '-';
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const colors: Record<string, string> = {
                    'Menunggu Pembayaran': 'bg-yellow-200 text-white-800',
                    Batal: 'bg-red-200 text-white-800',
                    Pending: 'bg-orange-200 text-white-800',
                    'Sudah dibayar': 'bg-green-200 text-white-800',
                };
                return (
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colors[status] ?? 'bg-gray-200 text-gray-800'}`}>{status}</span>
                );
            },
        },
        {
            accessorKey: 'payment_amount',
            header: 'Jumlah Bayar',
            cell: ({ row }) => `Rp ${Number(row.getValue('payment_amount')).toLocaleString('id-ID')}`,
        },
        {
            accessorKey: 'payment_date',
            header: 'Tanggal Bayar',
            cell: ({ row }) => row.getValue('payment_date') || '-',
        },
        {
            accessorKey: 'checkout_link',
            header: 'Checkout Link',
            cell: ({ row }) => {
                const link = row.getValue('checkout_link') as string;
                return link ? (
                    <a href={link} target="_blank" className="text-blue-600 underline">
                        Link
                    </a>
                ) : (
                    '-'
                );
            },
        },
    ];

    const table = useReactTable({
        data: invoices,
        columns,
        state: { sorting, globalFilter, columnVisibility, rowSelection },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            const invoice = row.original;
            return (
                invoice.status.toLowerCase().includes(search) ||
                invoice.id_invoice.toString().includes(search) ||
                (invoice.payment_date?.toLowerCase().includes(search) ?? false) ||
                (invoice.user?.name.toLowerCase().includes(search) ?? false) ||
                (invoice.user?.email.toLowerCase().includes(search) ?? false)
            );
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoice" />
            <div className="p-4">
                <h1 className="mb-2 text-2xl font-bold">Daftar Invoice</h1>

                <div className="flex items-center gap-2 py-4">
                    <Input
                        placeholder="Cari invoice..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <div className="ml-auto">
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
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <InvoiceDetailDialog
                                        key={row.id}
                                        invoice={row.original}
                                        trigger={
                                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                                ))}
                                            </TableRow>
                                        }
                                    />
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
