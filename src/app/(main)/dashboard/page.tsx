"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Package, Receipt, Lightbulb } from "lucide-react";
import { getProductCount, getBillCount, getTotalSales } from '@/lib/firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

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
        <div>
          <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading your business overview...</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
    </div>
  );
}
