import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface CancelPaymentDialogProps {
    transactionId: number;
}

export default function CancelPaymentDialog({ transactionId }: CancelPaymentDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="bg-red-500 text-white hover:bg-red-700">
                    Batalkan Pembayaran
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Batalkan Pembayaran</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin membatalkan transaksi ini? Tindakan ini tidak bisa dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() =>
                            router.post(
                                route('invoice.cancel', { id: transactionId }),
                                {},
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                    onSuccess: () => {
                                        toast.success('Pembayaran berhasil dibatalkan');
                                    },
                                    onError: (errors) => {
                                        toast.error(errors.message ?? 'Pembayaran gagal dibatalkan');
                                    },
                                }
                            )
                        }
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        Ya, Batalkan
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
