
"use client";

import { useState, useEffect, Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getBills } from '@/lib/firebase/firestore';
import { analyzeSalesData, AnalyzeSalesDataOutput } from '@/ai/flows/analyze-sales-data';
import { Lightbulb, TrendingUp, Loader2, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';


const InsightsReport = lazy(() => import('./insights-report'));

export default function InsightsPage() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AnalyzeSalesDataOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to generate insights.',
      });
      return;
    }

    setLoading(true);
    setInsights(null);
    setShowReport(false);
    try {
      const bills = await getBills(user.uid, 20); // Fetch last 20 bills for analysis
      if (bills.length === 0) {
        toast({
          variant: 'default',
          title: 'Not Enough Data',
          description: 'No bills found to generate insights. Please create some bills first.',
        });
        setLoading(false);
        return;
      }

      // Format bills data for the AI model, ensuring dates are readable strings.
      const formattedBills = bills.map(bill => ({
        ...bill,
        createdAt: format(bill.createdAt, 'yyyy-MM-dd'),
      }));
      const billsData = JSON.stringify(formattedBills);
      
      const result = await analyzeSalesData({ billsData });
      setInsights(result);
      setShowReport(true); // Show the report component after getting data
      toast({
        title: 'Insights Generated',
        description: 'Successfully analyzed your sales data.',
      });
    } catch (error) {
      console.error('Failed to generate insights:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI insights. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">AI Sales Insights</h1>
          <p className="text-muted-foreground">
            Please log in to analyze your sales data with Gemini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">AI Sales Insights</h1>
        <p className="text-muted-foreground">
          Analyze your sales data with Gemini to discover trends and top products.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Lightbulb className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Generate New Report</h3>
                <p className="text-sm text-muted-foreground">
                  Click the button to process your recent bills and get the latest insights.
                </p>
              </div>
            </div>
            <Button onClick={handleGenerateInsights} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart className="mr-2 h-4 w-4" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && <InsightsReportSkeleton />}

      {showReport && insights && (
         <Suspense fallback={<InsightsReportSkeleton />}>
            <InsightsReport insights={insights} />
         </Suspense>
      )}
    </div>
  );
}

function InsightsReportSkeleton() {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 animate-pulse">
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
                </div>
                </CardContent>
            </Card>
            <Card className="md:col-span-2 animate-pulse">
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-5 w-full" />
                </div>
                </CardContent>
            </Card>
        </div>
    )
}
