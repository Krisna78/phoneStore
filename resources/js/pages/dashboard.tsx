import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type DashboardProps = PageProps & {
    stats: {
        products: number;
        pending_orders: number;
        paid_orders: number;
        users: number;
    };
    categories: {
        id_category: number;
        name: string;
        total_quantity: number;
    }[];
    topProducts: {
        id_product: number;
        name: string;
        total_quantity: number;
    }[];
    categoryMonthly: {
        month: string;
        year: number;
        categories: Record<number, number>;
    }[];
    popularBrands: {
        id_brand: number | null;
        brand_name: string;
        total_quantity: number;
    }[];
    merkMonthly: {
        month: string;
        merks: {
            id_brand: string;
            brand_name: string;
            total_quantity: number;
        }[];
    }[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function Dashboard() {
    const { stats, categories, topProducts, categoryMonthly, merkMonthly } = usePage<DashboardProps>().props;
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    // Data kategori bulanan
    const filteredCategoryData = categoryMonthly.find((m) => m.month === `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`);
    const categoryChartData = categories.map((c) => ({
        name: c.name,
        total: filteredCategoryData?.categories[c.id_category] ?? 0,
    }));

    // Data merk bulanan
    const filteredMerkData = merkMonthly.find((m) => m.month === `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`);
    const merkChartData = filteredMerkData
        ? filteredMerkData.merks.map((p) => ({
              name: p.brand_name,
              total: p.total_quantity,
          }))
        : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                {/* Statistik Cards */}
                <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-4 md:gap-4 scrollbar-hide">
                    <Card className="bg-blue-500 text-white shadow-md min-w-[200px] md:min-w-0 flex-shrink-0">
                        <CardHeader>
                            <CardTitle>Produk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.products}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-orange-500 text-white shadow-md min-w-[200px] md:min-w-0 flex-shrink-0">
                        <CardHeader>
                            <CardTitle>User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.users}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-500 text-white shadow-md min-w-[200px] md:min-w-0 flex-shrink-0">
                        <CardHeader>
                            <CardTitle>Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.pending_orders}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-500 text-white shadow-md min-w-[200px] md:min-w-0 flex-shrink-0">
                        <CardHeader>
                            <CardTitle>Terbayar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.paid_orders}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Analitik Tabs + Merk Populer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Analitik</CardTitle>
                        <div className="mt-2 flex gap-2">
                            <select
                                className="rounded-md border p-1 text-sm"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {months.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="rounded-md border p-1 text-sm"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {Array.from(new Set(categoryMonthly.map((m) => m.year))).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Chart (col-span-2) */}
                            <div className="col-span-2">
                                <Tabs defaultValue="kategori" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="kategori">Kategori Populer</TabsTrigger>
                                        <TabsTrigger value="merk">Merk Populer</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="kategori" className="mt-13">
                                        <ChartContainer
                                            className="mx-auto h-[250px] w-full"
                                            config={{
                                                total: { label: 'Total Terjual', color: 'hsl(var(--chart-1))' },
                                            }}
                                        >
                                            <BarChart data={categoryChartData} margin={{ left: 12, right: 12, bottom: 30 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} interval="preserveEnd" />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                                <Bar dataKey="total" fill="hsl(220, 80%, 60%)" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ChartContainer>
                                    </TabsContent>

                                    <TabsContent value="merk" className="mt-13">
                                        <ChartContainer
                                            className="mx-auto h-[250px] w-full"
                                            config={{
                                                total: { label: 'Total Terjual', color: 'hsl(var(--chart-2))' },
                                            }}
                                        >
                                            <BarChart data={merkChartData} margin={{ left: 12, right: 12, bottom: 40 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                    interval={0}
                                                    tick={({ x, y, payload }) => {
                                                        const words = payload.value.split(' ');
                                                        return (
                                                            <text x={x} y={y + 10} textAnchor="middle" fontSize={12}>
                                                                {words.map((word, index) => (
                                                                    <tspan
                                                                        key={index}
                                                                        x={x}
                                                                        dy={index === 0 ? 0 : 14}
                                                                    >
                                                                        {word}
                                                                    </tspan>
                                                                ))}
                                                            </text>
                                                        );
                                                    }}
                                                />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                                <Bar dataKey="total" fill="hsl(150, 70%, 45%)" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ChartContainer>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* Merk Populer (col-span-1) */}
                            <div className="col-span-1">
                                <Card className="p-4 shadow-sm">
                                    <h3 className="mb-3 font-semibold">Produk yang banyak dicari</h3>
                                    <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2">
                                        {topProducts.slice(0, 9).map((p, i) => (
                                            <div key={i} className="flex items-center gap-3 rounded-lg border p-2 shadow-sm">
                                                {/* Logo dummy: huruf pertama */}
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 font-semibold">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{p.name}</span>
                                                    <span className="text-sm text-gray-500">{p.total_quantity} x Terjual</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
