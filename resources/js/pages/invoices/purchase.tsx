import CancelPaymentDialog from '@/components/modal/cancel-payment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, ChevronDown, Download, Filter, X } from 'lucide-react';
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
  allTransactions: Transaction[];
}

const TransactionPage = () => {
  const { props } = usePage<PageProps>();
  const { flash } = props;

  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [dateFilter, setDateFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [, setFilteredTransactions] = useState<Transaction[]>([]);

  const statusOptions = ['Semua', 'Berlangsung', 'Berhasil', 'Tidak Berhasil', 'E-tiket & E-voucher Aktif'];

  const transactions = props.transactions.data;
  const pagination = props.transactions;
  const allTransactions = props.allTransactions;

  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success);
    } else if (props.flash?.error) {
      toast.error(props.flash.error);
    }
  }, [flash, props.flash?.error, props.flash?.success]);

  useEffect(() => {
    if (selectedStatus === 'Semua') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = allTransactions.filter((transaction) => {
        switch (selectedStatus) {
          case 'Berlangsung':
            return ['Pending', 'Menunggu Pembayaran', 'Diproses'].includes(transaction.status);
          case 'Berhasil':
            return ['Selesai', 'Sudah dibayar', 'Berhasil'].includes(transaction.status);
          case 'Tidak Berhasil':
            return ['Batal', 'Gagal', 'Tidak Berhasil'].includes(transaction.status);
          case 'E-tiket & E-voucher Aktif':
            return ['Aktif', 'Terverifikasi'].includes(transaction.status);
          default:
            return true;
        }
      });
      setFilteredTransactions(filtered);
    }
  }, [selectedStatus, transactions, allTransactions]);

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

  const handleDownload = () => {
    console.log('Download laporan transaksi');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Head title="Daftar Transaksi" />

      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Daftar Transaksi</h1>

          {/* Filter Section */}
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center space-x-2">
              <Checkbox id="all-products" />
              <label htmlFor="all-products" className="text-sm font-medium text-gray-700">
                Semua Produk
              </label>
            </div>

            <div className="relative flex items-center space-x-2">
              <Checkbox
                id="date-filter"
                checked={dateFilter}
                onCheckedChange={(checked) => {
                  setDateFilter(checked === true);
                  setShowDatePicker(checked === true);
                }}
              />
              <label htmlFor="date-filter" className="text-sm font-medium text-gray-700">
                Pilih Tanggal Transaksi
              </label>
              <ChevronDown className="h-4 w-4 text-gray-500" />

              {showDatePicker && (
                <div className="absolute top-full right-0 z-10 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold">Pilih Tanggal</h4>
                    <Button variant="ghost" size="sm" onClick={() => setShowDatePicker(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mb-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Hari Ini
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      7 Hari Terakhir
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Bulan Ini
                    </Button>
                  </div>
                  <div className="mt-3">
                    <p className="mb-2 text-sm text-gray-600">Custom Range:</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Mulai
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Selesai
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            {/* Status Filter */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
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

            {/* Reset Filter */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Menampilkan {transactions.length} dari {allTransactions.length} transaksi
              </span>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                <Filter className="mr-1 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">Tidak ada transaksi yang ditemukan</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
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
                            {product.quantity} barang × Rp{product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Total Belanja</span>
                      <span className="text-lg font-bold text-gray-900">
                        Rp{transaction.total.toLocaleString('id-ID')}
                      </span>
                    </div>
                    {(transaction.status === 'Pending' || transaction.status === 'Menunggu Pembayaran') && (
                      <div className="mt-4 text-right">
                        <CancelPaymentDialog transactionId={transaction.id} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="mt-6 flex justify-center">
            <nav className="flex flex-wrap gap-2">
              {pagination.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    link.active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </nav>
          </div>
        )}

        {/* Download Button */}
        {transactions.length > 0 && (
          <div className="fixed right-6 bottom-6">
            <Button className="h-12 w-12 rounded-full shadow-lg" onClick={handleDownload}>
              <Download className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
