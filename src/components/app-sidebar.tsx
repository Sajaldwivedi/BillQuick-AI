"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useProductStore } from '@/hooks/use-product-store';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  Lightbulb, 
  LogOut, 
  IndianRupee,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/billing', label: 'Billing', icon: Receipt },
  { href: '/insights', label: 'AI Insights', icon: Lightbulb },
];

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <Link key={item.label} href={item.href}>
          <Button
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-base">{item.label}</span>
          </Button>
        </Link>
      ))}
    </nav>
  );
};

const MobileNavLinks = () => {
    const pathname = usePathname();
  
    return (
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <SheetClose asChild key={item.label}>
            <Link href={item.href}>
                <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
                >
                <item.icon className="h-5 w-5" />
                <span className="text-base">{item.label}</span>
                </Button>
            </Link>
          </SheetClose>
        ))}
      </nav>
    );
  };


export function AppSidebar() {
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = useAuth();
  const { clearProducts } = useProductStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      clearProducts(); // Clear the product store
      await logout();
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to sign out.' });
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden p-2 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col bg-background">
             <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-headline font-bold">BillQuick AI</h2>
                </div>
              </div>
              <div className="flex-1 p-4">
                <MobileNavLinks />
              </div>
              <div className="p-4 border-t">
                <Button onClick={handleSignOut} variant="outline" className="w-full justify-start gap-3">
                  <LogOut className="h-5 w-5" />
                  <span className="text-base">Sign Out</span>
                </Button>
              </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-background border-r p-4">
        <div className="flex items-center gap-3 mb-8">
          <IndianRupee className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-headline font-bold">BillQuick AI</h2>
        </div>
        <div className="flex-1">
          <NavLinks />
        </div>
        <Button onClick={handleSignOut} variant="outline" className="w-full justify-start gap-3">
          <LogOut className="h-5 w-5" />
          <span className="text-base">Sign Out</span>
        </Button>
      </aside>
    </>
  );
}
