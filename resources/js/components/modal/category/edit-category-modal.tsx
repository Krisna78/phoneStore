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
  image: z.any().optional(), // opsional saat edit
});

type FormData = z.infer<typeof schema>;

type CategoryType = {
  id_category: number;
  category_name: string;
  image: string;
};

interface EditCategoryModalProps {
  category: CategoryType;
  onSuccess?: (updatedCategory?: CategoryType) => void;
}

export default function EditCategoryModal({
  category,
  onSuccess,
}: EditCategoryModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category_name: category.category_name,
      image: undefined,
    },
  });

  function onSubmit(data: FormData) {
    const formData = new FormData();
    formData.append("category_name", data.category_name);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    router.post(`/category/${category.id_category}/update`, formData, {
      forceFormData: true,
      onSuccess: (page) => {
        setOpen(false);

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updatedCategory = (page.props as any)?.categories?.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (c: any) =>
              String(c.id_category) === String(category.id_category)
          );
          if (onSuccess && updatedCategory) {
            onSuccess(updatedCategory);
          } else {
            router.reload({ only: ["categories"] });
          }
        } catch {
          router.reload({ only: ["categories"] });
        }
      },
      onError: (errors) => {
        if (errors.category_name) {
            toast.error(errors.category_name);
        } else {
            toast.error("Gagal memperbarui kategori. Coba lagi.");
        }
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-lg">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Kategori</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            encType="multipart/form-data"
          >
            {/* Nama Kategori */}
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

            {/* Upload Gambar */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Gambar Kategori (opsional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>

                  {category.image && (
                    <div className="mt-2">
                      <p className="mb-1 text-sm text-muted-foreground">
                        Gambar saat ini:
                      </p>
                      <img
                        src={
                          category.image.startsWith("http")
                            ? category.image
                            : `/storage/${category.image}`
                        }
                        alt={category.category_name}
                        className="h-20 w-20 rounded border object-cover"
                      />
                    </div>
                  )}

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
