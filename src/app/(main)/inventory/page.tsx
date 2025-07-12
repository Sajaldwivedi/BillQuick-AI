
"use client";

import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductsTable = lazy(() =>
  import('./products-table').then((module) => ({ default: module.default }))
);


export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <div>
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
