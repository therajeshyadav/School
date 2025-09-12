"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { School, Plus, Eye, Home, LogIn, LogOut, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/add-school", label: "Add School", icon: Plus },
    { href: "/show-schools", label: "View Schools", icon: Eye },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900"
          >
            <School className="h-6 w-6 text-blue-600" />
            SchoolHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "flex items-center gap-2",
                      isActive && "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {/* Auth Buttons */}
            {!user ? (
              <>
                {/* Login */}
                <Link href="/login">
                  <Button
                    variant={pathname === "/login" ? "default" : "ghost"}
                    className={cn(
                      "flex items-center gap-2",
                      pathname === "/login" &&
                        "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </Button>
                </Link>

                {/* Signup */}
                <Link href="/signup">
                  <Button
                    variant={pathname === "/signup" ? "default" : "ghost"}
                    className={cn(
                      "flex items-center gap-2",
                      pathname === "/signup" &&
                        "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    <UserPlus className="h-4 w-4" /> Signup
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "p-2",
                      isActive && "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </Link>
              );
            })}

            {/* Auth Buttons (mobile) */}
            {!user ? (
              <>
                <Link href="/login">
                  <Button
                    size="sm"
                    variant={pathname === "/login" ? "default" : "ghost"}
                    className={cn(
                      "flex items-center gap-2",
                      pathname === "/login" &&
                        "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    variant={pathname === "/signup" ? "default" : "ghost"}
                    className={cn(
                      "flex items-center gap-2",
                      pathname === "/signup" &&
                        "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    <UserPlus className="h-4 w-4" /> Signup
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                onClick={handleLogout}
                size="sm"
                variant="destructive"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
