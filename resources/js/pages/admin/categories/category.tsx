'use client';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect } from 'react';

import AddCategoryModal from '@/components/modal/category/add-category-modal';
import { DeleteCategoryModal } from '@/components/modal/category/delete-category-modal';
import EditCategoryModal from '@/components/modal/category/edit-category-modal';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Category',
    href: '/category',
  },
];

export type CategoryType = {
  id_category: number;
  category_name: string;
  image: string;
};

interface CategoryTableProps {
  categories: CategoryType[];
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function CategoryTable({ categories: initialCategories, flash }: CategoryTableProps) {
  const [categories, setCategories] = React.useState<CategoryType[]>(initialCategories ?? []);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    setCategories(initialCategories ?? []);
  }, [initialCategories]);

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash?.success, flash?.error]);

  const columns: ColumnDef<CategoryType>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const category = row.original;
        if (!category) return null;
        const imageUrl = category.image
          ? category.image.startsWith('http')
            ? category.image
            : `/storage/${category.image}`
          : '/placeholder.png';
        return (
          <img
            src={imageUrl}
            alt={category?.category_name ?? 'No name'}
            className="h-16 w-16 rounded-md object-cover"
          />
        );
      },
    },
    {
      accessorKey: 'category_name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original?.category_name ?? '-', // amanin
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        const category = row.original;
        if (!category) return null;
        return (
          <div className="flex items-center gap-2">
            <EditCategoryModal category={category} />
            <DeleteCategoryModal
              id={category.id_category}
              name={category.category_name}
              onSuccess={(deletedId) => {
                setCategories((prev) =>
                  prev.filter((c) => c.id_category !== deletedId),
                );
              }}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: categories,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      return row.original?.category_name?.toLowerCase().includes(search) ?? false;
    },
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Category" />
      <div className="p-4">
        <h1 className="mb-2 text-2xl font-bold">Daftar Kategori</h1>
        <div className="flex items-center gap-2 py-4">
          <Input
            placeholder="Cari kategori..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <div className="ml-auto flex gap-2">
            <AddCategoryModal
              onSuccess={(newCategory) => {
                setCategories((prev) => [...prev, newCategory]);
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
