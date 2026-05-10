import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  User,
  Store,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  FileText,
  TrendingUp,
  Heart,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuthStore } from '@/stores/authStore';
import { Button, Avatar, AvatarFallback, AvatarImage, Badge } from '@/components/ui';
import logo from '@/assets/images/logo.svg';

interface DashboardLayoutProps {
  children: React.ReactNode;
  type: 'retailer' | 'supplier';
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string | number;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const retailerNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/retailer' },
    { icon: ShoppingCart, label: 'Orders', href: '/dashboard/retailer/orders', badge: 3 },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/retailer/settings' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/retailer/notifications', badge: 5 },
  ];

  const supplierNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/supplier' },
    { icon: Package, label: 'Products', href: '/dashboard/supplier/products' },
    { icon: Plus, label: 'Add Product', href: '/dashboard/supplier/products/add' },
    { icon: ShoppingCart, label: 'Orders', href: '/dashboard/supplier/orders', badge: 2 },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/supplier/analytics' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/supplier/settings' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/supplier/notifications', badge: 8 },
  ];

  const navItems = type === 'retailer' ? retailerNavItems : supplierNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActiveRoute = (href: string) => {
    if (href === `/dashboard/${type}`) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-dark/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r border-border z-50 transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'w-64' : 'w-20',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center">
                <img src={logo} alt="Torida Logo" className="h-full w-full object-contain" />
              </div>
              {isSidebarOpen && (
                <span className="text-xl font-bold text-dark">Torida</span>
              )}
            </Link>
            
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-elevated"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                      isActive
                        ? type === 'retailer'
                          ? 'bg-primary text-white shadow-md shadow-primary/30'
                          : 'bg-teal text-white shadow-md shadow-teal/30'
                        : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 flex-shrink-0',
                        isActive ? 'text-white' : 'text-text-muted group-hover:text-current'
                      )}
                    />
                    {isSidebarOpen && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant={isActive ? 'outline' : 'primary'}
                            className={cn(
                              'ml-auto text-xs',
                              isActive && 'border-white/30 text-white'
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                    {!isSidebarOpen && item.badge && (
                      <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-border" />

            {/* Quick Links */}
            <div className="space-y-1">
              <Link
                to="/help"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-text-muted" />
                {isSidebarOpen && <span>Help Center</span>}
              </Link>
              <Link
                to="/rfq"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
              >
                <FileText className="h-5 w-5 text-text-muted" />
                {isSidebarOpen && <span>Request Quote</span>}
              </Link>
            </div>
          </nav>

          {/* User Section */}
          <div className="border-t border-border p-4">
            <div className={cn('flex items-center gap-3', !isSidebarOpen && 'justify-center')}>
              <Avatar className="h-10 w-10 ring-2 ring-border">
                <AvatarImage src={user?.business_profile?.logo_url} />
                <AvatarFallback className={cn(
                  'text-sm font-medium',
                  type === 'retailer' ? 'bg-primary text-white' : 'bg-teal text-white'
                )}>
                  {user?.full_name?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {type === 'retailer' ? 'Retailer' : 'Supplier'}
                  </p>
                </div>
              )}
            </div>

            {isSidebarOpen && (
              <button
                onClick={handleLogout}
                className="mt-3 flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error-light transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Collapse Toggle (Desktop) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full bg-white border border-border shadow-sm hover:bg-surface-elevated transition-colors"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4 text-text-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-text-muted" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Top Bar */}
        <header className="sticky top-0 h-16 bg-white/95 backdrop-blur-sm border-b border-border z-30">
          <div className="h-full px-4 md:px-6 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-elevated"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page Title / Breadcrumb */}
            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-text-primary">
                {type === 'retailer' ? 'Retailer Dashboard' : 'Supplier Dashboard'}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {type === 'retailer' && (
                <Link to="/products">
                  <Button size="sm" leftIcon={<TrendingUp className="h-4 w-4" />}>
                    Browse Products
                  </Button>
                </Link>
              )}
              {type === 'supplier' && (
                <Link to="/dashboard/supplier/products/add">
                  <Button size="sm" variant="teal" leftIcon={<Plus className="h-4 w-4" />}>
                    Add Product
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
