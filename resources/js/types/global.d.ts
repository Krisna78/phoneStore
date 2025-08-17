import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}
declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps {
    flash: {
      success?: string;
      error?: string;
    };
     soldProducts: {
      name: string;
      stock: number;
    }[];
    pendingInvoices: number;
    paidInvoices: number;
  }
}
