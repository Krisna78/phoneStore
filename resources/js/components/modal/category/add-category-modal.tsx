"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
  category_name: z.string().min(1, "Nama kategori wajib diisi"),
  image: z
    .any()
    .refine((files) => files?.length > 0, "Gambar wajib ditambahkan"),
});

type FormData = z.infer<typeof schema>;

interface AddCategoryModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (newCategory?: any) => void;
}

export default function AddCategoryModal({ onSuccess }: AddCategoryModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category_name: "",
      image: undefined,
    },
  });

  function onSubmit(data: FormData) {
    const formData = new FormData();
    formData.append("category_name", data.category_name);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    router.post(route("category.store"), formData, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        if (onSuccess) onSuccess();
      },
      onError: () => {
        toast.error("Gagal menambahkan kategori. Coba lagi.");
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-lg bg-blue-600 hover:bg-blue-700">
          Tambah Kategori
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kategori</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            encType="multipart/form-data"
          >
            <FormField
              control={form.control}
              name="category_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama kategori" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files as FileList)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-3">
              <Button
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
                size="sm"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
