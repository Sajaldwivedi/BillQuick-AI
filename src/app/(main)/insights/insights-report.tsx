
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, TrendingUp } from 'lucide-react';
import type { AnalyzeSalesDataOutput } from '@/ai/flows/analyze-sales-data';

interface InsightsReportProps {
  insights: AnalyzeSalesDataOutput;
}

export default function InsightsReport({ insights }: InsightsReportProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 items-start">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top 5 Selling Items
          </CardTitle>
          <CardDescription>Products your customers love the most.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {insights.topSellingItems.map((item, index) => (
              <li key={index} className="flex items-center text-sm font-medium p-2 rounded-md bg-slate-50 dark:bg-slate-800">
                <span className="text-primary font-bold w-6">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Summary Report
          </CardTitle>
          <CardDescription>A quick analysis of your sales trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{insights.summaryReport}</p>
        </CardContent>
      </Card>
    </div>
  );
}
