
"use client";

import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BillingForm = lazy(() => import('./billing-form').then(module => ({ default: module.BillingForm })));

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
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
