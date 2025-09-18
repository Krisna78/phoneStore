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

const schema = z.object({
  merk_name: z.string().min(1, "Nama merk wajib diisi"),
});

type FormData = z.infer<typeof schema>;

interface EditMerkModalProps {
  merk: { id_merk: number; merk_name: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (updatedMerk: any) => void;
}

export default function EditMerkModal({ merk, onSuccess }: EditMerkModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      merk_name: merk.merk_name,
    },
  });

  function onSubmit(data: FormData) {
    router.post(route('merk.update',merk.id_merk), data, {
      onSuccess: (page) => {
        setOpen(false);
        if (onSuccess) onSuccess(page.props.merk);
      },
      onError: (errors) => {
        if (errors.merk_name) {
            toast.error(errors.merk_name);
        } else {
            toast.error("Gagal menambahkan merk. Coba lagi.");
        }
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-lg">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Merk</DialogTitle>
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
                    <Input {...field} />
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
