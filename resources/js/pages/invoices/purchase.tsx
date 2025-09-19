'use client';

import CancelPaymentDialog from '@/components/modal/invoices/cancel-payment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Product {
    name: string;
    quantity: number;
    price: number;
}

interface Transaction {
    id: number;
    date: string;
    status: string;
    invoice: string;
    store: string;
    checkout_link: string;
    expire_date: string;
    products: Product[];
    total: number;
}

interface PaginatedResponse<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

interface PageProps extends InertiaPageProps {
    transactions: PaginatedResponse<Transaction>;
    filters: {
        status?: string;
    };
}

const TransactionPage = () => {
    const { props } = usePage<PageProps>();
    const { flash, transactions, filters } = props;

    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'Semua');
    const statusOptions = ['Semua', 'Berlangsung', 'Berhasil', 'Tidak Berhasil'];

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Selesai':
            case 'Sudah dibayar':
            case 'Berhasil':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Pending':
            case 'Menunggu Pembayaran':
            case 'Diproses':
            case 'Berlangsung':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Batal':
            case 'Gagal':
            case 'Tidak Berhasil':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        router.get(route('invoice.purchase'), { status }, { preserveState: true });
    };

    const handleGoBack = () => {
        router.get(route('homepage'), {}, { replace: true });
    };

    const formatStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            'Sudah dibayar': 'Selesai',
            'Menunggu Pembayaran': 'Berlangsung',
            Pending: 'Berlangsung',
            Batal: 'Dibatalkan',
            Gagal: 'Tidak Berhasil',
        };
        return statusMap[status] || status;
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <Head title="Daftar Transaksi" />

            <div className="mx-auto max-w-4xl px-4">
                {/* Header dengan tombol kembali */}
                <div className="mb-6 flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleGoBack}
                        className="group flex items-center gap-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Kembali</span>
                    </Button>
                </div>

                {/* Content */}
                <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                    <h1 className="mb-6 text-2xl font-bold text-gray-900">Daftar Transaksi</h1>

                    {/* Status Filter */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="mb-6">
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Status</h3>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((status) => (
                                    <Button
                                        key={status}
                                        variant={selectedStatus === status ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleStatusChange(status)}
                                        className={`rounded-full px-4 ${
                                            selectedStatus === status
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Info jumlah transaksi */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Menampilkan {transactions.data.length} dari {transactions.total} transaksi
                            </span>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                    {transactions.data.length === 0 ? (
                        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                            <p className="text-gray-500">Tidak ada transaksi yang ditemukan</p>
                        </div>
                    ) : (
                        transactions.data.map((transaction) => (
                            <div key={transaction.id} className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Belanja {transaction.date}</h3>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Badge className={`px-2 py-1 text-xs ${getStatusVariant(transaction.status)}`}>
                                                {formatStatus(transaction.status)}
                                            </Badge>
                                            <span className="text-sm text-gray-500">{transaction.invoice}</span>
                                        </div>
                                        {transaction.status === 'Pending' && transaction.expire_date && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Berlaku hingga:{' '}
                                                <span className="font-medium text-gray-700">
                                                    {new Date(transaction.expire_date).toLocaleString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="mb-4">
                                        <h4 className="mb-3 text-base font-semibold text-gray-900">{transaction.store}</h4>
                                        {transaction.products.map((product, index) => (
                                            <div key={index} className="mb-3 flex items-start justify-between last:mb-0">
                                                <div className="flex-1">
                                                    <p className="mb-1 text-sm font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {product.quantity} barang × Rp
                                                        {product.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-900">Total Belanja</span>
                                            <span className="text-lg font-bold text-gray-900">Rp{transaction.total.toLocaleString('id-ID')}</span>
                                        </div>
                                        {(transaction.status === 'Pending' || transaction.status === 'Menunggu Pembayaran') && (
                                            <div className="mt-4 justify-end gap-2 text-right">
                                                <CancelPaymentDialog transactionId={transaction.id} />
                                                <Button
                                                    size="sm"
                                                    className="ml-3 bg-blue-600 text-white hover:bg-blue-700"
                                                    onClick={() => router.visit(route('invoice.redirect', { id: transaction.id }))}
                                                >
                                                    Bayar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {transactions && transactions.links.length > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex flex-wrap gap-2">
                            {transactions.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`rounded-md border px-3 py-1 text-sm ${
                                        link.active
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}

                {/* Scroll to top */}
                <div className="fixed right-6 bottom-6">
                    <Button className="h-12 w-12 rounded-full shadow-lg transition-transform hover:scale-105" onClick={scrollToTop}>
                        <ArrowUp className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TransactionPage;
