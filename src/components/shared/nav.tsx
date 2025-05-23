import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import {
  PackageOpen,
  Home,
  User,
  LogIn,
  LogOut,
  Menu,
  ChevronDown,
  LayoutDashboard,
  Truck,
  MapPin,
  Settings,
  Bell,
  Search,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  user: any | null;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  authRequired: boolean;
  desktop?: boolean;
  mobile?: boolean;
  userMenu?: boolean;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: Home, authRequired: false, desktop: true, mobile: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, authRequired: true, desktop: true, mobile: true, userMenu: true },
  { to: '/deliveries', label: 'Deliveries', icon: Truck, authRequired: true, desktop: true, mobile: true, badge: 3 },
  { to: '/route', label: 'Route Map', icon: MapPin, authRequired: true, desktop: true, mobile: true },
  { to: '/profile', label: 'Profile', icon: Settings, authRequired: true, userMenu: true, mobile: true },
];

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.displayName) {
      const names = user.displayName.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary font-semibold' : 'text-slate-600 hover:text-primary';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search - navigate to search results or filter current page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const renderNavLink = (item: NavItem, inDropdown = false) => {
    const IconComponent = item.icon;
    
    if (inDropdown) {
      return (
        <DropdownMenuItem key={item.to} asChild>
          <Link 
            to={item.to} 
            className="flex items-center gap-2 w-full cursor-pointer"
          >
            <IconComponent className="h-4 w-4" />
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary">
                {item.badge}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
      );
    }

    return (
      <Link
        key={item.to}
        to={item.to}
        className={`relative text-sm transition-colors ${isActive(item.to)} group`}
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <IconComponent className="h-5 w-5 mb-1" />
            {item.badge && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          <span>{item.label}</span>
          <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ease-out ${
            location.pathname === item.to ? 'w-full' : 'w-0 group-hover:w-1/2'
          }`} />
        </div>
      </Link>
    );
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm transition-all duration-200 ${
        scrolled 
          ? 'border-b border-gray-200 bg-white shadow-sm' 
          : 'bg-white/80'
      }`}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-full">
            <PackageOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">DeliverEase</span>
        </Link>

        {/* Desktop Search Bar - shows on medium screens and larger */}
        <form 
          onSubmit={handleSearch} 
          className="hidden md:flex relative mx-4 flex-1 max-w-sm"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search deliveries, routes..."
              className="pl-9 pr-4 py-2 h-10 bg-gray-100 border-gray-200 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-sm">
          {navItems.filter(item => item.desktop && (!item.authRequired || user)).map(item => renderNavLink(item))}
        </nav>

        {/* User Authentication Area (Desktop) */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {user && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs">
                2
              </Badge>
            </Button>
          )}

          {!user ? (
            <>
              <Link to="/signin">
                <Button variant="ghost" size="sm" className="gap-1.5 text-gray-700 hover:text-primary hover:bg-primary/5">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-white shadow-sm"> 
                  <User className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 rounded-full hover:bg-gray-100 pl-2 pr-3"> 
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback className="bg-primary text-white font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden lg:inline"> 
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50 hidden lg:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 p-2">
                <DropdownMenuLabel className="py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || 'User Profile'}
                    </p>
                    {user.email && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                {navItems.filter(item => item.userMenu && item.authRequired).map(item => {
                  const IconComponent = item.icon;
                  return (
                    <DropdownMenuItem key={item.to} asChild className="py-2 my-1 rounded-md">
                      <Link to={item.to} className="flex w-full cursor-pointer items-center">
                        <IconComponent className="mr-2 h-4 w-4" />
                        {item.label}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex cursor-pointer items-center py-2 my-1 rounded-md text-red-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Navigation Menu - NEW DROPDOWN IMPLEMENTATION */}
        <div className="md:hidden flex items-center ml-auto gap-2"> 
          {user && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs">
                2
              </Badge>
            </Button>
          )}

          {/* Mobile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Navigation Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 mt-1 p-2">
              {/* Mobile search */}
              <div className="p-2 mb-2">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2 h-10 bg-gray-100 border-gray-200 focus-visible:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
              
              {/* User info if logged in */}
              {user && (
                <>
                  <DropdownMenuLabel className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback className="bg-primary text-white font-medium">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || 'User Profile'}
                        </p>
                        {user.email && (
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Navigation Items */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-semibold uppercase text-gray-500 pt-2">
                  Navigation
                </DropdownMenuLabel>
                {navItems
                  .filter(item => item.mobile && (!item.authRequired || user))
                  .map(item => renderNavLink(item, true))
                }
              </DropdownMenuGroup>

              {/* Settings & Tools Submenu */}
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-semibold uppercase text-gray-500 pt-2">
                      Settings & Tools
                    </DropdownMenuLabel>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <Link to="/profile" className="flex w-full items-center">
                              Profile Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link to="/notifications" className="flex w-full items-center">
                              Notifications
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link to="/privacy" className="flex w-full items-center">
                              Privacy
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </>
              )}

              {/* Authentication Options */}
              <DropdownMenuSeparator />
              {!user ? (
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/signin" className="flex w-full cursor-pointer items-center gap-2 py-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/signup" className="flex w-full cursor-pointer items-center gap-2 py-2 text-primary font-medium">
                      <User className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : (
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex cursor-pointer items-center gap-2 py-2 text-red-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;