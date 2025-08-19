import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { router } from "@inertiajs/react"

type InvoiceItem = {
  id: number
  name: string
  image_url?: string
  quantity: number
  price: number
}

type Invoice = {
  invoice_date: string
  external_id: string
  description: string
  status: string
  payment_amount: number
  payment_date: string | null
  items: InvoiceItem[]
}

export default function Receipt({ invoice }: { invoice: Invoice }) {
  const isPaid = invoice.status === "Sudah dibayar"

  // Fungsi cek apakah link URL absolute (http/https) atau storage
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl
    }
    return `/storage/${imageUrl}`
  }
  const totalBarang = invoice.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg print:w-full print:max-w-full print:shadow-none">

        {/* Header */}
        <CardHeader>
          <div
            className={`mx-auto mb-4 flex items-center justify-center h-24 w-24 rounded-full ${
              isPaid ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isPaid ? (
              <CheckCircle2 className="h-20 w-20 text-green-600" />
            ) : (
              <XCircle className="h-20 w-20 text-red-600" />
            )}
          </div>
          <CardTitle className="text-center">
            {isPaid ? "Pembayaran Berhasil" : "Pembayaran Belum Selesai"}
          </CardTitle>
        </CardHeader>

        {/* Invoice Info */}
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Tanggal:</strong> {invoice.invoice_date}</p>
            <p><strong>Nomor Invoice:</strong> {invoice.external_id}</p>
            <p><strong>Deskripsi:</strong> {invoice.description}</p>
            <p><strong>Status:</strong> {invoice.status}</p>
            <p><strong>Jumlah Dibayar:</strong> Rp {invoice.payment_amount.toLocaleString()}</p>
            {invoice.payment_date && (
              <p><strong>Tanggal Bayar:</strong> {invoice.payment_date}</p>
            )}
          </div>

          {/* Daftar Barang */}
          {invoice.items.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Detail Barang</h3>
              <ul className="divide-y border rounded-md">
                {invoice.items.map((item) => {
                  const imgUrl = getImageUrl(item.image_url)
                  return (
                    <li key={item.id} className="flex items-center gap-3 p-2 text-sm">
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={item.name}
                          className="h-12 w-12 rounded object-cover border"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} x Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-semibold">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </li>
                  )
                })}
              </ul>
              {/* Total Semua Barang */}
              <div className="flex justify-between font-semibold text-sm mt-4 px-2">
                <span>Total Barang</span>
                <span>Rp {totalBarang.toLocaleString()}</span>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex gap-2 print:hidden">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.visit("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>

          {isPaid && (
            <Button
              className="flex-1"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" /> Cetak Struk
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
