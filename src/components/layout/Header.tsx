import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  Store,
  Heart,
  Sparkles,
  LayoutDashboard,
  Shield,
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { usePermission } from '@/hooks/usePermission';
import { Button } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import logo from '@/assets/images/logo.svg';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const { isAdmin, isSeller, isBuyer, dashboardPath } = usePermission();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isProfileOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-profile-dropdown]')) {
          setIsProfileOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/suppliers', label: 'Suppliers' },
    { href: '/rfq', label: 'RFQ' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    window.location.href = '/login';
  };

  // Determine dashboard button label based on role
  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Dashboard';
    if (isSeller) return 'Seller Dashboard';
    if (isBuyer) return 'Buyer Dashboard';
    return 'Dashboard';
  };

  const getDashboardIcon = () => {
    if (isAdmin) return Shield;
    if (isSeller) return Store;
    return LayoutDashboard;
  };

  const DashboardIcon = getDashboardIcon();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-border/50'
          : 'bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60 border-b border-border'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative h-10 w-10 group-hover:scale-105 transition-all duration-300">
              <img src={logo} alt="Torida Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-dark to-dark-light bg-clip-text text-transparent hidden sm:block">
              Torida
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative px-4 py-2 text-sm font-medium group"
                >
                  <span
                    className={cn(
                      'relative z-10 transition-colors duration-200',
                      isActive ? 'text-primary' : 'text-text-secondary group-hover:text-primary'
                    )}
                  >
                    {link.label}
                  </span>
                  
                  {/* Animated underline */}
                  <span
                    className={cn(
                      'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                  
                  {/* Active background */}
                  {isActive && (
                    <span className="absolute inset-0 bg-primary/5 rounded-lg" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className={cn(
              'relative w-full group transition-all duration-300',
              searchFocused && 'transform scale-105'
            )}>
              <div className={cn(
                'absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-teal/20 blur-sm transition-opacity duration-300',
                searchFocused ? 'opacity-100' : 'opacity-0'
              )} />
              <Search className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 z-10',
                searchFocused ? 'text-primary' : 'text-text-muted'
              )} />
              <input
                type="search"
                placeholder="Search products, suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={cn(
                  'relative w-full h-10 pl-10 pr-4 rounded-xl border bg-surface-elevated text-sm transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:border-transparent',
                  searchFocused
                    ? 'ring-primary/30 border-primary shadow-lg shadow-primary/5'
                    : 'border-border hover:border-border-dark'
                )}
              />
              
              {/* Keyboard shortcut hint */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-1 text-xs text-text-muted">
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">K</kbd>
              </div>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                {/* Dashboard Button - Desktop */}
                <Link to={dashboardPath} className="hidden md:block">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:text-primary gap-1.5"
                  >
                    <DashboardIcon className="h-4 w-4" />
                    <span className="hidden lg:inline">{getDashboardLabel()}</span>
                  </Button>
                </Link>

                {/* Wishlist */}
                <Link to="/wishlist">
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="relative group hover:text-primary"
                  >
                    <Heart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                  </Button>
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="relative group hover:text-primary"
                  >
                    <Bell className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-error text-[10px] font-bold text-white flex items-center justify-center animate-scaleIn">
                      3
                    </span>
                  </Button>
                </div>

                {/* Cart */}
                <Link to="/cart">
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="relative group hover:text-primary"
                  >
                    <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    {totalItems > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center animate-scaleIn shadow-lg shadow-primary/30">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative ml-2" data-profile-dropdown>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={cn(
                      'flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200',
                      isProfileOpen ? 'bg-surface-elevated shadow-md' : 'hover:bg-surface-elevated'
                    )}
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
                      <AvatarImage src={user?.business_profile?.logo_url} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-medium">
                        {user?.full_name?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className={cn(
                      'h-4 w-4 text-text-muted transition-transform duration-200',
                      isProfileOpen && 'rotate-180'
                    )} />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={cn(
                      'absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-surface shadow-xl py-2 z-50 transition-all duration-200 origin-top-right',
                      isProfileOpen
                        ? 'opacity-100 scale-100 visible'
                        : 'opacity-0 scale-95 invisible'
                    )}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.business_profile?.logo_url} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary-dark text-white">
                            {user?.full_name?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-text-primary">{user?.full_name}</p>
                          <p className="text-xs text-text-muted">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      {/* Dashboard Link — role-based */}
                      <Link
                        to={dashboardPath}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-primary transition-colors duration-200 group"
                      >
                        <DashboardIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        {getDashboardLabel()}
                      </Link>

                      {/* Admin Panel Link — only for admin users */}
                      {isAdmin && dashboardPath !== '/admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-primary transition-colors duration-200 group"
                        >
                          <Shield className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                          Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-primary transition-colors duration-200 group"
                      >
                        <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        Profile
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-primary transition-colors duration-200 group"
                      >
                        <Package className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        Orders
                      </Link>
                      
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-primary transition-colors duration-200 group"
                      >
                        <Settings className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        Settings
                      </Link>
                    </div>
                    
                    <div className="border-t border-border pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-light/50 w-full transition-colors duration-200 group"
                      >
                        <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:text-primary"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm"
                    className="group"
                    leftIcon={<Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-200" />}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-5 h-5">
                <Menu className={cn(
                  'absolute inset-0 h-5 w-5 transition-all duration-300',
                  isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                )} />
                <X className={cn(
                  'absolute inset-0 h-5 w-5 transition-all duration-300',
                  isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                )} />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-out',
            isMenuOpen ? 'max-h-[500px] border-t border-border py-4' : 'max-h-0'
          )}
        >
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-surface-elevated text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>
          
          <nav className="flex flex-col gap-1">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'text-text-secondary hover:bg-surface-elevated hover:text-primary'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Dashboard Link */}
            {isAuthenticated && (
              <Link
                to={dashboardPath}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-elevated hover:text-primary transition-all duration-200 flex items-center gap-2"
              >
                <DashboardIcon className="h-4 w-4" />
                {getDashboardLabel()}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
