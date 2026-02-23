import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DollarSign, CreditCard, Package, RefreshCcw, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const salesStats = [
  { title: 'Total Sales', value: '$124,592', change: '+18.2% from last month', changeType: 'positive' as const, icon: DollarSign },
  { title: 'Transactions', value: '3,847', change: '+12.1% from last month', changeType: 'positive' as const, icon: CreditCard },
  { title: 'Items Sold', value: '8,429', change: '+5.4% from last month', changeType: 'positive' as const, icon: Package },
  { title: 'Returns', value: '$2,847', change: '-3.2% from last month', changeType: 'negative' as const, icon: RefreshCcw },
];

const monthlyData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 5000, orders: 320 },
  { name: 'Apr', sales: 4500, orders: 278 },
  { name: 'May', sales: 6000, orders: 389 },
  { name: 'Jun', sales: 5500, orders: 349 },
];

const categoryData = [
  { name: 'Kitchen Appliances', value: 35 },
  { name: 'Cookware', value: 25 },
  { name: 'Utensils & Tools', value: 20 },
  { name: 'Storage & Org', value: 12 },
  { name: 'Tableware', value: 8 },
];

const COLORS = ['hsl(54, 90%, 55%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(30, 20%, 40%)'];

const topProducts = [
  { name: 'KitchenPro Stand Mixer', sales: 234, revenue: '$46,732' },
  { name: 'Smart Air Fryer XL', sales: 189, revenue: '$18,811' },
  { name: 'Ceramic Knife Set (8-pc)', sales: 456, revenue: '$11,456' },
  { name: 'Cast Iron Skillet 12"', sales: 312, revenue: '$9,360' },
  { name: 'Bamboo Cutting Board Set', sales: 287, revenue: '$8,610' },
];

export default function Sales() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Track your home appliances & kitchen utensils sales performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {salesStats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bar Chart */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-card-foreground">Monthly Sales & Orders</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 18%)" />
                  <XAxis dataKey="name" stroke="hsl(40, 15%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(40, 15%, 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(30, 20%, 11%)',
                      border: '1px solid hsl(30, 15%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(50, 80%, 90%)',
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(54, 90%, 55%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="orders" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-card-foreground">Sales by Category</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(30, 20%, 11%)',
                      border: '1px solid hsl(30, 15%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(50, 80%, 90%)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between rounded-lg bg-secondary/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-success">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
