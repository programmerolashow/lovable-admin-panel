import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, MoreVertical, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  excerpt: string | null;
  status: string;
  category: string;
  views: number;
  created_at: string;
  user_id: string;
}

export default function Blog() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', status: 'In Stock', category: 'Appliances' });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!user,
  });

  const upsertMutation = useMutation({
    mutationFn: async (values: typeof form & { id?: string }) => {
      if (values.id) {
        const { error } = await supabase.from('products').update({
          title: values.title,
          excerpt: values.excerpt,
          status: values.status,
          category: values.category,
        }).eq('id', values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert({
          title: values.title,
          excerpt: values.excerpt,
          status: values.status,
          category: values.category,
          user_id: user!.id,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(editingProduct ? 'Product updated!' : 'Product added!');
      closeDialog();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ title: '', excerpt: '', status: 'In Stock', category: 'Appliances' });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ title: p.title, excerpt: p.excerpt || '', status: p.status, category: p.category });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate(editingProduct ? { ...form, id: editingProduct.id } : form);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your home appliances and kitchen utensils catalog
            </p>
          </div>
          <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Products Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No products yet. Click "Add Product" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Views</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{product.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{product.excerpt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.status === 'In Stock' ? 'bg-success/10 text-success' : product.status === 'Low Stock' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {product.views.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openEdit(product)}>
                              <Edit className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={() => deleteMutation.mutate(product.id)}>
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="bg-secondary border-border" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Appliances">Appliances</SelectItem>
                    <SelectItem value="Utensils">Utensils</SelectItem>
                    <SelectItem value="Cookware">Cookware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={upsertMutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {upsertMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : editingProduct ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
