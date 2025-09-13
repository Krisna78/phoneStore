'use client';

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteCategoryModalProps {
  id: number;
  name: string;
  onSuccess?: (deletedId: number) => void;
}

export function DeleteCategoryModal({
  id,
  name,
  onSuccess,
}: DeleteCategoryModalProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    router.delete(`/category/${id}`, {
      onSuccess: () => {
        setOpen(false);
        if (onSuccess) onSuccess(id);
      },
      onError: () => toast.error('Gagal menghapus kategori'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Kategori</DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin menghapus kategori{' '}
            <span className="font-semibold">{name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
