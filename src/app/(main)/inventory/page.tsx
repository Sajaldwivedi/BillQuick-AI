
"use client";

import { Suspense, lazy, useState as useReactState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/app-sidebar';

const ProductsTable = lazy(() =>
  import('./products-table').then((module) => ({ default: module.default }))
);

function InventoryHeaderMobile({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="md:hidden flex items-center gap-3 px-3 py-3 sticky top-0 z-30 bg-white/90 border-b shadow-sm">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 active:bg-gray-200 transition"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-primary" />
      </button>
      <h1 className="text-xl font-headline font-bold tracking-tight">Inventory</h1>
    </div>
  );
}

export default function InventoryPage() {
  const [isSheetOpen, setIsSheetOpen] = useReactState(false);
  return (
    <div className="space-y-8">
      {/* Mobile Header and Sidebar Sheet */}
      <div className="md:hidden">
        <InventoryHeaderMobile onMenuClick={() => setIsSheetOpen(true)} />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="left" className="w-72 p-0 flex flex-col bg-background">
            <AppSidebar mobileOnly />
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop Heading */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-headline font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">
          Add, edit, or delete products available in your shop.
        </p>
      </div>
      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable />
      </Suspense>
    </div>
  );
}

function ProductsTableSkeleton() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border rounded-md">
        <TableSkeletonHeader />
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TableSkeletonHeader() {
    return (
        <div className="p-4 border-b grid grid-cols-4 gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24 justify-self-end" />
        </div>
    );
}
