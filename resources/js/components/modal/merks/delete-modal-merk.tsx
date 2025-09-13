"use client";

import { router } from "@inertiajs/react";
import { useState } from "react";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteMerkModalProps {
  id: number;
  name: string;
  onSuccess?: (deletedId: number) => void;
}

export function DeleteMerkModal({ id, name, onSuccess }: DeleteMerkModalProps) {
  const [loading, setLoading] = useState(false);

  function handleDelete() {
    setLoading(true);
    router.delete(route("merk.destroy",id), {
      onSuccess: () => {
        if (onSuccess) onSuccess(id);
      },
      onError: () => {
        toast.error("Gagal menghapus merk. Coba lagi.");
      },
      onFinish: () => setLoading(false),
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="rounded-lg">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Merk</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menghapus merk <b>{name}</b>? Tindakan ini
            tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
