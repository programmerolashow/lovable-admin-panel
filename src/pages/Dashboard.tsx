import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Package, DollarSign, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statsData = [
  { title: 'Total Products', value: '1,284', change: '+12.5% from last month', changeType: 'positive' as const, icon: Package },
  { title: 'Revenue', value: '$48,574', change: '+8.2% from last month', changeType: 'positive' as const, icon: DollarSign },
  { title: 'Orders', value: '1,429', change: '-2.1% from last month', changeType: 'negative' as const, icon: ShoppingCart },
  { title: 'Growth', value: '3.24%', change: '+0.5% from last month', changeType: 'positive' as const, icon: TrendingUp },
];

const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

export default function Dashboard() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here's an overview of your home appliances & kitchen store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Chart Section */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">Revenue Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(54, 90%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(54, 90%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(54, 90%, 55%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New blender added to inventory', time: '2 minutes ago', user: 'KitchenPro 3000' },
              { action: 'Order completed', time: '15 minutes ago', user: 'Order #1234 — Ceramic Knife Set' },
              { action: 'Product review published', time: '1 hour ago', user: 'Air Fryer XL — 4.8★' },
              { action: 'Payment received', time: '3 hours ago', user: '$299.00 — Stand Mixer' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-secondary/50 p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.user}</p>
                </div>
                <span className="text-sm text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
