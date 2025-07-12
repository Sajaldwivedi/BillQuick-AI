"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Package, Receipt, Lightbulb } from "lucide-react";
import { getProductCount, getBillCount, getTotalSales } from '@/lib/firebase/firestore';
import Link from 'next/link';

export default function DashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pCount, bCount, tSales] = await Promise.all([
          getProductCount(),
          getBillCount(),
          getTotalSales()
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
  }, []);
  
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a quick overview of your shop.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="h-6 w-24 rounded-md bg-muted"></div>
                        <div className="h-8 w-8 rounded-full bg-muted"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-32 rounded-md bg-muted mb-2"></div>
                        <div className="h-4 w-48 rounded-md bg-muted"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
            <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-6 w-6 ${stat.color} ${stat.bgColor} p-1 rounded-full`} />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
            </Card>
            ))}
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <Link href="/billing">
            <CardContent className="p-6 flex items-center space-x-4">
              <Receipt className="h-10 w-10 text-primary" />
              <div>
                <h3 className="text-lg font-headline font-semibold">Create New Bill</h3>
                <p className="text-muted-foreground text-sm">Start a new transaction and generate an invoice.</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <Link href="/insights">
            <CardContent className="p-6 flex items-center space-x-4">
              <Lightbulb className="h-10 w-10 text-accent" />
              <div>
                <h3 className="text-lg font-headline font-semibold">Get AI Insights</h3>
                <p className="text-muted-foreground text-sm">Analyze your sales data to uncover trends.</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
