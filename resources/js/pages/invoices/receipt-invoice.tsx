// resources/js/Pages/Invoice/Receipt.tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft,CheckCircle2 } from "lucide-react"
import { router } from "@inertiajs/react"

type Invoice = {
  invoice_date: string
  external_id: string
  description: string
  status: string
  payment_amount: number
  payment_date: string
}

export default function Receipt({ invoice }: { invoice: Invoice }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
            <div className="mx-auto mb-4 flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
            <CheckCircle2 className="h-20 w-20 text-green-600" />
          </div>
          <CardTitle className="text-center">Struk Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Tanggal:</strong> {invoice.invoice_date}</p>
            <p><strong>Nomor Invoice:</strong> {invoice.external_id}</p>
            <p><strong>Deskripsi:</strong> {invoice.description}</p>
            <p><strong>Status:</strong> {invoice.status}</p>
            <p><strong>Jumlah Dibayar:</strong> Rp {invoice.payment_amount.toLocaleString()}</p>
            <p><strong>Tanggal Bayar:</strong> {invoice.payment_date}</p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.visit("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <Button
            className="flex-1"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" /> Cetak Struk
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
