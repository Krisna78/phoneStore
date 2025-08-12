"use client"

import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { usePage } from '@inertiajs/react';
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
import { type BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Product", href: "/product" },
  { title: "Add Product", href: "/product/add" },
]

type FormData = {
  "Input-2": string
  "Input-3": string
  "Input-4": FileList
  "Textarea-5": string
  "MultiSelect-5": string
  "MultiSelect-6": string
}

type MerkType = {
  id_merk: number
  merk_name: string
}

type CategoryType = {
  id_category: number
  category_name: string
}

export default function AddProductForm() {
  const { merk, category } = usePage().props as unknown as {
    merk: MerkType[];
    category: CategoryType[];
  };
  const form = useForm<FormData>({
    defaultValues: {
      "Input-2": "",
      "Input-3": "",
      "Textarea-5": "",
      "MultiSelect-5": "",
      "MultiSelect-6": "",
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData()
    formData.append("name", data["Input-2"])
    formData.append("price", data["Input-3"])
    formData.append("description", data["Textarea-5"])
    formData.append("merk_id", data["MultiSelect-5"])
    formData.append("category_id", data["MultiSelect-6"])

    if (data["Input-4"] && data["Input-4"].length > 0) {
      formData.append("image", data["Input-4"][0]) // ambil file pertama
    }

    try {
    const response = await fetch("/product/store", {
        method: "POST",
        body: formData,
        headers: {
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
    });

    if (response.redirected) {
        window.location.href = response.url;
        return;
    }

    if (!response.ok) {
        alert("Gagal menambahkan produk. Status: " + response.status);
        return;
    }
    alert("Produk berhasil ditambahkan!");
    form.reset();

    } catch (error) {
    alert("Terjadi kesalahan saat mengirim data");
    console.error(error);
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Product" />
      <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-4 border"
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold">Tambah Produk</h2>

          {/* Nama Produk */}
          <div className="w-full">
            <label className="block font-medium mb-1" htmlFor="Input-2">
              Nama Produk
            </label>
            <Input
              id="Input-2"
              {...form.register("Input-2", { required: "Nama Produk wajib diisi" })}
              placeholder="Masukkan nama produk"
            />
            {form.formState.errors["Input-2"] && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors["Input-2"]?.message}
              </p>
            )}
          </div>

          {/* Harga */}
          <div className="w-full">
            <label className="block font-medium mb-1" htmlFor="Input-3">
              Harga
            </label>
            <Input
              id="Input-3"
              type="number"
              {...form.register("Input-3", { required: "Harga wajib diisi" })}
              placeholder="Nominal produk"
            />
            {form.formState.errors["Input-3"] && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors["Input-3"]?.message}
              </p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-medium mb-1" htmlFor="Textarea-5">
              Deskripsi
            </label>
            <Textarea
              id="Textarea-5"
              {...form.register("Textarea-5", { required: "Deskripsi wajib diisi" })}
              placeholder="Masukkan deskripsi produk anda"
              className="resize-none"
            />
            {form.formState.errors["Textarea-5"] && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors["Textarea-5"]?.message}
              </p>
            )}
          </div>

          {/* Merk */}
          <div className="w-full">
            <label className="block font-medium mb-1" htmlFor="MultiSelect-5">
              Merk
            </label>
            <Select
              {...form.register("MultiSelect-5", { required: "Merk wajib dipilih" })}
              onValueChange={(value) => form.setValue("MultiSelect-5", value)}
              value={form.watch("MultiSelect-5")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Merk" />
              </SelectTrigger>
              <SelectContent>
                {merk.map((c) => (
                    <SelectItem key={c.id_merk} value={c.id_merk.toString()}>
                    {c.merk_name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors["MultiSelect-5"] && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors["MultiSelect-5"]?.message}
              </p>
            )}
          </div>

          {/* Kategori */}
          <div className="w-full">
            <label className="block font-medium mb-1" htmlFor="MultiSelect-6">
              Kategori
            </label>
            <Select
              {...form.register("MultiSelect-6", { required: "Kategori wajib dipilih" })}
              onValueChange={(value) => form.setValue("MultiSelect-6", value)}
              value={form.watch("MultiSelect-6")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori Produk" />
              </SelectTrigger>
              <SelectContent>
                {category.map((c) => (
                    <SelectItem key={c.id_category} value={c.id_category.toString()}>
                    {c.category_name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors["MultiSelect-6"] && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors["MultiSelect-6"]?.message}
              </p>
            )}
          </div>

          {/* Upload Gambar */}
          <div className="w-full">
            <label htmlFor="Input-4" className="block font-medium mb-1">
              Gambar Produk
            </label>
            <Input
              id="Input-4"
              type="file"
              accept="image/*"
              {...form.register("Input-4", { required: "Gambar wajib ditambahkan" })}
            />
            {form.formState.errors["Input-4"] && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors["Input-4"]?.message}
              </p>
            )}
          </div>

          <div className="flex justify-end items-center w-full pt-3">
            <Button className="rounded-lg" size="sm" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menambahkan..." : "Tambah"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
