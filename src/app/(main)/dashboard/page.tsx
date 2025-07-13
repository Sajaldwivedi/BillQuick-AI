"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Package, Receipt, Lightbulb, Menu } from "lucide-react";
import { getProductCount, getBillCount, getTotalSales } from '@/lib/firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/app-sidebar';
import { useState as useReactState } from 'react';

function DashboardHeaderMobile({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="md:hidden flex items-center gap-3 px-3 py-3 sticky top-0 z-30 bg-white/90 border-b shadow-sm">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 active:bg-gray-200 transition"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-primary" />
      </button>
      <h1 className="text-xl font-headline font-bold tracking-tight">Dashboard</h1>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useReactState(false);
  const [isSheetOpen, setIsSheetOpen] = useReactState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const [pCount, bCount, tSales] = await Promise.all([
          getProductCount(user.uid),
          getBillCount(user.uid),
          getTotalSales(user.uid)
        ]);
        setProductCount(pCount);
        setBillCount(bCount);
        setTotalSales(tSales);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const stats = [
    {
      title: "Total Sales",
      value: `₹${totalSales.toFixed(2)}`,
      icon: IndianRupee,
      color: "text-green-500",
      bgColor: "bg-green-100",
      description: "Total revenue from all bills"
    },
    {
      title: "Total Bills",
      value: billCount,
      icon: Receipt,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      description: "Total invoices generated"
    },
    {
      title: "Products in Inventory",
      value: productCount,
      icon: Package,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      description: "Total items available"
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardHeaderMobile onMenuClick={() => {}} />
        <div className="flex flex-col gap-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="rounded-2xl shadow-md bg-blue-50/60 border-0 px-4 py-3 animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Header and Sidebar Sheet */}
      <div className="md:hidden">
        <DashboardHeaderMobile onMenuClick={() => setIsSheetOpen(true)} />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="left" className="w-72 p-0 flex flex-col bg-background">
            <AppSidebar mobileOnly />
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop Heading */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      {/* Card Container */}
      <div className="flex flex-col gap-4 mt-4 md:grid md:grid-cols-3 md:gap-6 md:flex-row">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="rounded-2xl shadow-md bg-blue-50/60 border-0 px-4 py-3 md:p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-1">
                <CardTitle className="text-base font-semibold md:text-lg">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold md:text-3xl">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 md:text-sm">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/billing" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Create New Bill</div>
              <div className="text-sm text-muted-foreground">Generate invoice for customer</div>
            </Link>
            <Link href="/inventory" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Manage Inventory</div>
              <div className="text-sm text-muted-foreground">Add or update products</div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Get AI-powered insights about your sales performance and trends.
            </p>
            <Link href="/insights" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Generate Insights
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
