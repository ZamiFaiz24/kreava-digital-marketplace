import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, CalendarDays, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/seller/layout/dashboard-layout';

interface RevenuePoint {
    date: string;
    label: string;
    revenue: number;
    sales: number;
}

interface TopProduct {
    id: number;
    title: string;
    category: string;
    sales_count: number;
    revenue: number;
}

interface CategoryBreakdown {
    category: string;
    revenue: number;
    sales_count: number;
}

type Period = 'today' | '7d' | '30d' | 'custom';

interface AnalyticsFilters {
    period: Period;
    start_date: string;
    end_date: string;
    label: string;
}

interface AnalyticsPageProps {
    filters: AnalyticsFilters;
    summary: {
        total_revenue: number;
        total_paid_orders: number;
        avg_order_value: number;
        monthly_growth: number;
        this_month_revenue: number;
    };
    revenue_data: RevenuePoint[];
    top_products: TopProduct[];
    category_breakdown: CategoryBreakdown[];
}

function formatCurrency(value: number) {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export default function SellerAnalyticsPage({ filters, summary, revenue_data, top_products, category_breakdown }: AnalyticsPageProps) {
    const [period, setPeriod] = useState<Period>(filters.period);
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [isLoading, setIsLoading] = useState(false);
    const [dateError, setDateError] = useState<string | null>(null);

    useEffect(() => {
        setPeriod(filters.period);
        setStartDate(filters.start_date);
        setEndDate(filters.end_date);
    }, [filters.period, filters.start_date, filters.end_date]);

    const maxRevenue = Math.max(...revenue_data.map((item) => item.revenue), 1);

    const visitWithFilters = (params: Record<string, string>) => {
        setDateError(null);

        router.get(route('seller.analytics'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
        });
    };

    const handlePeriodChange = (value: string) => {
        const nextPeriod = value as Period;
        setPeriod(nextPeriod);

        if (nextPeriod === 'custom') {
            setDateError(null);
            return;
        }

        visitWithFilters({ period: nextPeriod });
    };

    const applyCustomRange = () => {
        if (!startDate || !endDate) {
            setDateError('Start date and end date are required.');
            return;
        }

        if (startDate > endDate) {
            setDateError('End date must be on or after the start date.');
            return;
        }

        visitWithFilters({
            period: 'custom',
            start_date: startDate,
            end_date: endDate,
        });
    };

    return (
        <>
            <Head title="Seller Analytics" />
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-foreground text-2xl font-bold">Analytics</h1>
                        <p className="text-muted-foreground text-sm">Performance trends and revenue insights from your store.</p>
                    </div>

                    <div className="border-border rounded-xl border bg-white p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="period">Period</Label>
                                    <Select value={period} onValueChange={handlePeriodChange} disabled={isLoading}>
                                        <SelectTrigger id="period" className="w-[180px]">
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="today">Today</SelectItem>
                                            <SelectItem value="7d">Last 7 days</SelectItem>
                                            <SelectItem value="30d">Last 30 days</SelectItem>
                                            <SelectItem value="custom">Custom range</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {period === 'custom' && (
                                    <>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="start_date">Start date</Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={startDate}
                                                onChange={(event) => {
                                                    setStartDate(event.target.value);
                                                    setDateError(null);
                                                }}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="end_date">End date</Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={endDate}
                                                onChange={(event) => {
                                                    setEndDate(event.target.value);
                                                    setDateError(null);
                                                }}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={applyCustomRange}
                                            disabled={isLoading}
                                            className="bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}
                                            Apply
                                        </Button>
                                    </>
                                )}
                            </div>

                            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                                <span>
                                    Showing: <span className="text-foreground font-medium">{filters.label}</span>
                                </span>
                                {isLoading && (
                                    <span className="inline-flex items-center gap-1.5 text-xs">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Updating...
                                    </span>
                                )}
                            </div>
                        </div>

                        {dateError && (
                            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-rose-500">
                                <AlertCircle className="h-4 w-4" />
                                {dateError}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="border-border rounded-xl border bg-white p-4">
                            <p className="text-muted-foreground text-xs tracking-wide uppercase">Total Revenue</p>
                            <p className="text-foreground mt-2 text-2xl font-bold">{formatCurrency(summary.total_revenue)}</p>
                        </div>
                        <div className="border-border rounded-xl border bg-white p-4">
                            <p className="text-muted-foreground text-xs tracking-wide uppercase">Paid Orders</p>
                            <p className="text-foreground mt-2 text-2xl font-bold">{summary.total_paid_orders}</p>
                        </div>
                        <div className="border-border rounded-xl border bg-white p-4">
                            <p className="text-muted-foreground text-xs tracking-wide uppercase">Avg Order Value</p>
                            <p className="text-foreground mt-2 text-2xl font-bold">{formatCurrency(summary.avg_order_value)}</p>
                        </div>
                        <div className="border-border rounded-xl border bg-white p-4">
                            <p className="text-muted-foreground text-xs tracking-wide uppercase">Monthly Growth</p>
                            <p className="text-foreground mt-2 text-2xl font-bold">{summary.monthly_growth}%</p>
                        </div>
                    </div>

                    <div className="border-border rounded-xl border bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-foreground text-lg font-bold">Revenue</h2>
                            <span className="text-muted-foreground text-xs">{filters.label}</span>
                        </div>
                        <div className="mt-4 overflow-x-auto pb-2">
                            <div className="flex min-w-full items-end gap-2">
                                {revenue_data.map((point) => (
                                    <div key={point.date} className="flex max-w-[80px] min-w-[42px] flex-1 flex-col items-center gap-2">
                                        <div className="bg-muted/40 flex h-36 w-full items-end rounded-md p-1">
                                            <div
                                                className="w-full rounded bg-indigo-600"
                                                style={{ height: `${Math.max((point.revenue / maxRevenue) * 100, 3)}%` }}
                                                title={`${point.date} - ${formatCurrency(point.revenue)} (${point.sales} sales)`}
                                            />
                                        </div>
                                        <p className="text-muted-foreground text-[11px]">{point.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="border-border rounded-xl border bg-white p-5">
                            <h2 className="text-foreground text-lg font-bold">Top Products</h2>
                            <div className="mt-4 space-y-3">
                                {top_products.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No sales data yet.</p>
                                ) : (
                                    top_products.map((product) => (
                                        <div key={product.id} className="border-border rounded-lg border p-3">
                                            <p className="text-foreground text-sm font-semibold">{product.title}</p>
                                            <p className="text-muted-foreground text-xs">{product.category}</p>
                                            <div className="mt-2 flex items-center justify-between text-sm">
                                                <span>{product.sales_count} sales</span>
                                                <span className="font-semibold">{formatCurrency(product.revenue)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="border-border rounded-xl border bg-white p-5">
                            <h2 className="text-foreground text-lg font-bold">Category Breakdown</h2>
                            <div className="mt-4 space-y-3">
                                {category_breakdown.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No category revenue yet.</p>
                                ) : (
                                    category_breakdown.map((item) => (
                                        <div key={item.category} className="border-border rounded-lg border p-3">
                                            <p className="text-foreground text-sm font-semibold">{item.category}</p>
                                            <div className="mt-2 flex items-center justify-between text-sm">
                                                <span>{item.sales_count} sales</span>
                                                <span className="font-semibold">{formatCurrency(item.revenue)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
