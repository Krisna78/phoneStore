"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

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
import { Plus } from "lucide-react";

const schema = z.object({
  merk_name: z.string().min(1, "Nama merk wajib diisi"),
});

type FormData = z.infer<typeof schema>;

interface AddMerkModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (newMerk: any) => void;
}

export default function AddMerkModal({ onSuccess }: AddMerkModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      merk_name: "",
    },
  });

  function onSubmit(data: FormData) {
    router.post("/merk/store", data, {
      onSuccess: (page) => {
        form.reset();
        setOpen(false);
        if (onSuccess) onSuccess(page.props.merk);
      },
      onError: () => {
        toast.error("Gagal menambahkan merk. Coba lagi.");
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-lg bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4"/>
          Tambah Merk
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Merk</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="merk_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Merk</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama merk" {...field} />
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
