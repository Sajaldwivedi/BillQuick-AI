
"use client";

import { Suspense, lazy, useState as useReactState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/app-sidebar';

const BillingForm = lazy(() => import('./billing-form').then(module => ({ default: module.BillingForm })));

function BillingHeaderMobile({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="md:hidden flex items-center gap-3 px-3 py-3 sticky top-0 z-30 bg-white/90 border-b shadow-sm">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 active:bg-gray-200 transition"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-primary" />
      </button>
      <h1 className="text-xl font-headline font-bold tracking-tight">New Bill</h1>
    </div>
  );
}

export default function BillingPage() {
  const [isSheetOpen, setIsSheetOpen] = useReactState(false);
  return (
    <div className="space-y-8">
      {/* Mobile Header and Sidebar Sheet */}
      <div className="md:hidden">
        <BillingHeaderMobile onMenuClick={() => setIsSheetOpen(true)} />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="left" className="w-72 p-0 flex flex-col bg-background">
            <AppSidebar mobileOnly />
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop Heading */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-headline font-bold">Create a New Bill</h1>
        <p className="text-muted-foreground">
          Select products and generate an invoice for your customer.
        </p>
      </div>
      <Suspense fallback={<BillingFormSkeleton />}>
        <BillingForm />
      </Suspense>
    </div>
  );
}

function BillingFormSkeleton() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex justify-between font-semibold">
            <Skeleton className="h-6 w-2/5" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-8" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-2/5" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
        <div className="flex justify-end pt-4 border-t">
            <div className="text-right space-y-2">
                <Skeleton className="h-8 w-48 ml-auto" />
                <Skeleton className="h-12 w-48" />
            </div>
        </div>
      </div>
    </div>
  )
}
