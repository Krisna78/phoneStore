'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, CreditCard, DollarSign, FileText, Package, ShoppingCart, User } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

interface InvoiceDetailDialogProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invoice: any;
    trigger?: React.ReactNode;
}

interface InvoiceItem {
    id?: string | number;
    product?: {
        id?: string | number;
        name?: string;
        image?: string;
    };
    product_name?: string;
    quantity: number;
    price: number;
}

export default function InvoiceDetailDialog({ invoice, trigger }: InvoiceDetailDialogProps) {
    const [open, setOpen] = useState(false);
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Sudah dibayar':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Menunggu Pembayaran':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Pending':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Batal':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    const getInvoiceItems = (): InvoiceItem[] => {
        if (!invoice) return [];
        const rawItems = invoice.items ?? invoice.details ?? invoice.products ?? invoice.item_detail ?? [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return rawItems.map((item: any) => ({
            ...item,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price ?? item.line_total ?? 0) || 0,
            product: item.product,
        }));
    };
    const getProductName = (item: InvoiceItem): string => {
        return item?.product?.name || item?.product_name || 'Produk tidak diketahui';
    };

    const calculateTotal = (): number => {
        if (invoice?.payment_amount) return Number(invoice.payment_amount);
        return getInvoiceItems().reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    };

    const items = getInvoiceItems();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <FileText className="h-6 w-6 text-blue-600" />
                            Detail Invoice #{invoice?.id_invoice || invoice?.id || 'N/A'}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Customer & Status */}
                    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-blue-600" />
                                        <span className="font-semibold">Customer:</span>
                                    </div>
                                    <p className="text-lg font-medium">{invoice?.user?.name || invoice?.customer_name || 'Tidak diketahui'}</p>
                                    <p className="text-sm text-gray-600">{invoice?.user?.email || invoice?.customer_email || ''}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-blue-600" />
                                        <span className="font-semibold">Status:</span>
                                    </div>
                                    <Badge className={`px-3 py-1 text-sm ${getStatusColor(invoice?.status)}`}>
                                        {invoice?.status || 'Tidak diketahui'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                Informasi Pembayaran
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                                    <p className="text-2xl font-bold text-green-600">Rp {calculateTotal().toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tanggal Pembayaran</p>
                                    <p className="text-lg font-medium">
                                        {invoice?.payment_date ? (
                                            <>
                                                {formatDate(invoice.payment_date)}
                                                <br />
                                                <span className="text-sm text-gray-500">{formatTime(invoice.payment_date)}</span>
                                            </>
                                        ) : (
                                            <span className="text-yellow-600">Menunggu pembayaran</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <Package className="h-5 w-5 text-orange-600" />
                                Produk
                            </h3>
                            {items.length > 0 ? (
                                <div className="space-y-3">
                                    {items.map((item, idx) => (
                                        <div key={item.id || idx} className="flex justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.product?.image ? `/storage/${item.product.image}` : 'https://placehold.co/600x400'}
                                                    alt={getProductName(item)}
                                                    className="h-12 w-12 rounded-md border object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400';
                                                    }}
                                                />
                                                <div>
                                                    <p className="font-medium">{getProductName(item)}</p>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">Rp {(Number(item.price) || 0).toLocaleString('id-ID')}</p>
                                                <p className="text-sm text-gray-600">
                                                    Total: Rp {((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
                                        <span>Total Belanja:</span>
                                        <span className="text-lg">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-gray-500">
                                    <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                    Tidak ada data barang
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                Informasi Tanggal
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-600">Tanggal Invoice</p>
                                    <p className="font-medium">
                                        {invoice?.invoice_date ? (
                                            <>
                                                {formatDate(invoice.invoice_date)}
                                                <br />
                                                <span className="text-sm text-gray-500">{formatTime(invoice.invoice_date)}</span>
                                            </>
                                        ) : (
                                            '-'
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Batas Pembayaran</p>
                                    <p className="font-medium">
                                        {invoice?.expire_date ? (
                                            <>
                                                {formatDate(invoice.expire_date)}
                                                <br />
                                                <span className="text-sm text-gray-500">{formatTime(invoice.expire_date)}</span>
                                            </>
                                        ) : (
                                            '-'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {invoice?.checkout_link && (
                        <div className="flex justify-end pt-4">
                            <Button asChild>
                                <a href={invoice.checkout_link} target="_blank" rel="noopener noreferrer">
                                    <CreditCard className="h-4 w-4" /> Lihat Pembayaran
                                </a>
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
