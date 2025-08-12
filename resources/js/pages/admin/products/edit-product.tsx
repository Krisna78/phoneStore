"use client"

import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AppLayout from "@/layouts/app-layout"
import { Head, usePage } from "@inertiajs/react"
import { type BreadcrumbItem } from "@/types"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Product", href: "/product" },
  { title: "Edit Product", href: "#" },
]

type FormData = {
  name: string
  price: string
  description: string
  merk_id: string
  category_id: string
  image: FileList
}

type MerkType = {
  id_merk: number
  merk_name: string
}

type CategoryType = {
  id_category: number
  category_name: string
}

type ProductType = {
  id_product: number
  name: string
  price: number
  description: string
  merk_id: number
  category_id: number
  image: string
}

export default function EditProductForm() {
  const { merk, category, product } = usePage().props as unknown as {
    merk: MerkType[]
    category: CategoryType[]
    product: ProductType
  }

  const form = useForm<FormData>({
    defaultValues: {
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      merk_id: product.merk_id.toString(),
      category_id: product.category_id.toString(),
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("price", data.price)
    formData.append("description", data.description)
    formData.append("merk_id", data.merk_id)
    formData.append("category_id", data.category_id)
    formData.append("_method", "POST")

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0])
    }

    try {
      const response = await fetch(`/product/${product.id_product}/update`, {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRF-TOKEN":
            document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
      })

      if (response.redirected) {
        window.location.href = response.url
        return
      }

      if (!response.ok) {
        alert("Gagal mengupdate produk. Status: " + response.status)
        return
      }
      alert("Produk berhasil diupdate!")
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim data")
      console.error(error)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Product" />
      <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-4 border"
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold">Edit Produk</h2>

          {/* Nama Produk */}
          <div>
            <label className="block font-medium mb-1">Nama Produk</label>
            <Input {...form.register("name", { required: "Nama Produk wajib diisi" })} />
            {form.formState.errors.name && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Harga */}
          <div>
            <label className="block font-medium mb-1">Harga</label>
            <Input type="number" {...form.register("price", { required: "Harga wajib diisi" })} />
            {form.formState.errors.price && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.price.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-medium mb-1">Deskripsi</label>
            <Textarea {...form.register("description", { required: "Deskripsi wajib diisi" })} />
            {form.formState.errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Merk */}
          <div>
            <label className="block font-medium mb-1">Merk</label>
            <Select
                onValueChange={(value) => form.setValue("merk_id", value, { shouldValidate: true })}
                value={form.watch("merk_id")}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Pilih Merk" />
                </SelectTrigger>
                <SelectContent>
                    {merk.map((m) => (
                    <SelectItem key={m.id_merk} value={m.id_merk.toString()}>
                        {m.merk_name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                {form.formState.errors.merk_id && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.merk_id.message}</p>
                )}
          </div>

          {/* Kategori */}
          <div>
            <label className="block font-medium mb-1">Kategori</label>
            <Select
              onValueChange={(value) => form.setValue("category_id", value)}
              value={form.watch("category_id")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {category.map((c) => (
                  <SelectItem key={c.id_category} value={c.id_category.toString()}>
                    {c.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block font-medium mb-1">Gambar Produk</label>
            <Input type="file" accept="image/*" {...form.register("image")} />
            {product.image && (
              <img
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : `/storage/${product.image}`
                }
                alt={product.name}
                className="mt-2 w-20 h-20 object-cover rounded"
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
