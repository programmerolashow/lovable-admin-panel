import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with React',
    excerpt: 'Learn the fundamentals of React and build your first component...',
    status: 'Published',
    author: 'John Doe',
    date: 'Dec 28, 2025',
    views: 1234,
  },
  {
    id: 2,
    title: 'Advanced TypeScript Patterns',
    excerpt: 'Explore advanced TypeScript patterns for scalable applications...',
    status: 'Draft',
    author: 'Jane Smith',
    date: 'Dec 27, 2025',
    views: 0,
  },
  {
    id: 3,
    title: 'Building APIs with Node.js',
    excerpt: 'A comprehensive guide to building RESTful APIs with Node.js...',
    status: 'Published',
    author: 'Mike Johnson',
    date: 'Dec 25, 2025',
    views: 856,
  },
  {
    id: 4,
    title: 'CSS Grid Mastery',
    excerpt: 'Master CSS Grid layout and create stunning responsive designs...',
    status: 'Published',
    author: 'Sarah Wilson',
    date: 'Dec 23, 2025',
    views: 2341,
  },
];

export default function Blog() {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog Posts</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and publish your blog content
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        {/* Posts Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Title</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Author</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Views</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{post.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.status === 'Published'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{post.author}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{post.date}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {post.views.toLocaleString()}
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
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
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
      </div>
    </DashboardLayout>
  );
}
