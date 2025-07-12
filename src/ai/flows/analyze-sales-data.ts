
'use server';

/**
 * @fileOverview AI flow to analyze sales data and provide insights.
 * 
 * - analyzeSalesData - Analyzes sales data and returns insights.
 * - AnalyzeSalesDataInput - Input type for the analyzeSalesData function.
 * - AnalyzeSalesDataOutput - Return type for the analyzeSalesData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSalesDataInputSchema = z.object({
  billsData: z.string().describe('JSON string containing recent bills data.'),
});
export type AnalyzeSalesDataInput = z.infer<typeof AnalyzeSalesDataInputSchema>;

const AnalyzeSalesDataOutputSchema = z.object({
  topSellingItems: z.array(z.string()).describe('Top 5 selling items based on quantity sold.'),
  summaryReport: z.string().describe('A short, insightful summary report of sales trends, including peak sales times or popular item combinations.'),
});
export type AnalyzeSalesDataOutput = z.infer<typeof AnalyzeSalesDataOutputSchema>;

export async function analyzeSalesData(input: AnalyzeSalesDataInput): Promise<AnalyzeSalesDataOutput> {
  return analyzeSalesDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSalesDataPrompt',
  input: {schema: AnalyzeSalesDataInputSchema},
  output: {schema: AnalyzeSalesDataOutputSchema},
  prompt: `You are an expert retail data analyst for a local shop. Your goal is to provide clear and actionable insights from sales data.

Analyze the following sales data, which is provided as a JSON string. The data represents a list of bills, where each bill has a customer name, a list of items sold, a total amount, and the date it was created.

Sales Data:
{{{billsData}}}

Based on this data, please perform the following analysis:
1.  Identify the top 5 best-selling items by the total quantity sold across all bills.
2.  Provide a concise summary report highlighting any interesting trends. This could include patterns like items frequently bought together, peak sales days, or customer behavior.

Your output must be in a valid JSON format, matching the specified output schema.`,
});

const analyzeSalesDataFlow = ai.defineFlow(
  {
    name: 'analyzeSalesDataFlow',
    inputSchema: AnalyzeSalesDataInputSchema,
    outputSchema: AnalyzeSalesDataOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI model did not return a valid output.');
      }
      return output;
    } catch (error) {
      console.error('Error analyzing sales data:', error);
      throw new Error('Failed to analyze sales data due to an internal error.');
    }
  }
);
