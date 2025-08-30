"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { router } from "@inertiajs/react"
import { toast } from "sonner"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter").max(100),
  price: z.string().min(1, "Harga wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi").max(1000),
  merk_id: z.string().min(1, "Merk wajib dipilih"),
  category_id: z.string().min(1, "Kategori wajib dipilih"),
  image: z.any().refine((files) => files?.length > 0, 'Gambar wajib ditambahkan'),
})

type FormData = z.infer<typeof schema>

type ReturnedProduct = {
  id_product: number | string
  name: string
  description: string
  price: number
  image: string
  merk?: { id_merk: number; merk_name: string }
  category?: { id_category: number; category_name: string }
}

interface AddProductModalProps {
  merk: { id_merk: number; merk_name: string }[]
  category: { id_category: number; category_name: string }[]
  onSuccess?: (newProduct?: ReturnedProduct) => void
}

export function AddProductModal({ merk, category, onSuccess }: AddProductModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      merk_id: "",
      category_id: "",
      image: undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("price", data.price)
    formData.append("description", data.description)
    formData.append("merk_id", data.merk_id)
    formData.append("category_id", data.category_id)

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0])
    }
    router.post('/product', formData, {
        onSuccess: () => {
            toast.success("Produk berhasil ditambahkan!")
            form.reset()
            setOpen(false)
            if (onSuccess) onSuccess()
        },
        onError: (errors) => {
            console.error('Error adding product:', errors)
            toast.error("Gagal menambahkan produk")
        },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4"/>
          Tambah Produk
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Nama Produk */}
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

            {/* Harga */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan harga"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="Masukkan deskripsi produk"
                      {...field}
                    />
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

            {/* Upload Gambar */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange} }) => (
                <FormItem>
                  <FormLabel>Gambar Produk</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                {isLoading ? "Menambahkan..." : "Tambah Produk"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
