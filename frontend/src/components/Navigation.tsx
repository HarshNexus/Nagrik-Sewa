import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  User,
  Settings,
  LogOut,
  Calendar,
  Bell,
  Menu,
  X,
  GraduationCap,
  FileText,
  HelpCircle,
  Briefcase,
  Users,
  Shield,
  Home as HomeIcon,
  ChevronDown,
} from "lucide-react";

import { LanguageSelector } from "@/components/LanguageSelector";
import { LocationSelector } from "@/components/LocationSelector";

interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  dropdown?: { href: string; label: string }[];
}

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActivePath = (path: string) => location.pathname === path;

  // Role-based navigation links
  const getNavLinks = (): NavLink[] => {
    if (!isAuthenticated) {
      return [
        { href: "/", label: t("navigation.home"), icon: HomeIcon },
        {
          href: "#workers",
          label: t("navigation.forWorkers"),
          icon: Users,
          dropdown: [
            { href: "/join-as-worker", label: t("navigation.joinAsWorker") },
            { href: "/find-customers", label: t("navigation.findCustomers") },
            { href: "/get-verified", label: t("navigation.getVerified") },
            { href: "/worker-support", label: t("navigation.workerSupport") },
          ],
        },
        {
          href: "#customers",
          label: t("navigation.forCustomers"),
          icon: Users,
          dropdown: [
            { href: "/join-as-customer", label: t("navigation.joinAsCustomer") },
            { href: "/workers", label: "Find Workers" },
            { href: "/get-verified", label: t("navigation.getVerified") },
            { href: "/customer-support", label: "Customer Support" },
          ],
        },
      ];
    }

    // Admin navigation - simplified to just Admin Dashboard
    if (user?.role === 'admin') {
      return [
        { href: "/admin", label: "Admin Dashboard", icon: Shield },
      ];
    }

    // Worker navigation
    if (user?.role === 'worker') {
      return [
        { href: "/", label: t("navigation.home"), icon: HomeIcon },
        { href: "/dashboard", label: "My Dashboard", icon: Briefcase },
        { href: "/find-customers", label: "Find Customers", icon: Users },
        { href: "/bookings", label: "My Bookings", icon: Calendar },
        { href: "/resume-builder", label: "Resume Builder", icon: FileText },
      ];
    }

    // Customer navigation (no Home tab - Dashboard is the main page)
    return [
      { href: "/dashboard", label: "Dashboard", icon: Briefcase },
      { href: "/workers", label: "Find Workers", icon: Users },
      { href: "/services", label: "Services", icon: Briefcase },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/logo-hindi.svg" alt="Nagrik Sewa" className="h-10 w-10 sm:h-12 sm:w-12" />
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-lg text-green-600">Nagrik Sewa</span>
              <span className="text-[10px] sm:text-xs text-gray-500 -mt-1 hidden sm:block">AI-Powered Services</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                {link.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                          isActivePath(link.href) ||
                          link.dropdown.some((subLink) => isActivePath(subLink.href))
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {link.icon && <link.icon className="h-4 w-4" />}
                        <span>{link.label}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {link.dropdown.map((subLink) => (
                        <DropdownMenuItem key={subLink.href} asChild>
                          <Link to={subLink.href} className="w-full hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
                            {subLink.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to={link.href}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                      isActivePath(link.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    <span>{link.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Language & Location Selectors - separate from nav links */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 border-l pl-3 xl:pl-4 flex-shrink-0">
            <LanguageSelector variant="compact" />
            <LocationSelector variant="compact" showDistrict />
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                {user?.role !== 'admin' && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/bookings">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t("navigation.bookings")}
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.firstName} />
                        <AvatarFallback>
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        {user?.role === 'admin' && (
                          <p className="text-xs font-semibold text-green-600 mt-1">Administrator</p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user?.role === 'admin' ? (
                      // Admin dropdown - simplified
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/profile">
                            <Settings className="mr-2 h-4 w-4" />
                            {t("navigation.profile")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      // Regular user dropdown - only Settings and Logout
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/profile">
                            <Settings className="mr-2 h-4 w-4" />
                            {t("navigation.profile")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("navigation.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">{t("navigation.login")}</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">{t("navigation.register")}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 space-y-2 pb-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navLinks.map((link) => (
              <div key={link.href}>
                {link.dropdown ? (
                  <>
                    <button
                      className="flex w-full items-center justify-between px-2 py-2 text-left text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.label ? null : link.label)
                      }
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === link.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {link.dropdown.map((subLink) => (
                          <Link
                            key={subLink.href}
                            to={subLink.href}
                            className={`block px-2 py-1 text-sm font-medium transition-colors hover:text-primary ${
                              isActivePath(subLink.href) ? "text-primary" : "text-muted-foreground"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className={`block px-2 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActivePath(link.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Language & Location in mobile */}
            <div className="mt-2 px-2 py-2 border-t space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Language</span>
                <LanguageSelector variant="compact" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <LocationSelector variant="compact" showDistrict />
              </div>
            </div>

            {/* Auth links in mobile */}
            <div className="mt-2 space-y-2 border-t pt-2">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' ? (
                    <Link
                      to="/admin"
                      className="block px-2 py-2 text-sm font-medium text-green-600 hover:text-green-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="inline h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/bookings"
                      className="block px-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("navigation.bookings")}
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navigation.profile")}
                  </Link>
                  <button
                    className="block w-full text-left px-2 py-2 text-sm font-medium text-red-500 hover:text-red-600"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    {t("navigation.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navigation.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navigation.register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
