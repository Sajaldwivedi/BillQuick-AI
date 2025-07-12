"use client";

import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, PlusCircle, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addBill, updateProductQuantity as updateProductQuantityInDB } from '@/lib/firebase/firestore';
import type { Bill, BillItem } from '@/types';
import { useRouter } from 'next/navigation';
import { generateInvoicePdf } from '@/lib/pdf';
import { useProductStore } from '@/hooks/use-product-store';
import { useAuth } from '@/hooks/use-auth';

type BillFormValues = {
  customerName: string;
  items: BillItem[];
};

export function BillingForm() {
  const { user } = useAuth();
  const { products, loading: loadingProducts, fetchProducts, updateProductQuantity } = useProductStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { register, control, handleSubmit, watch, setValue } = useForm<BillFormValues>({
    defaultValues: {
      customerName: '',
      items: [{ productId: '', name: '', quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchItems = watch('items');

  useEffect(() => {
    if (user) {
      fetchProducts(user.uid);
    }
  }, [fetchProducts, user]);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, productId);
      setValue(`items.${index}.name`, product.name);
      setValue(`items.${index}.price`, product.price);
    }
  };

  const calculateTotal = () => {
    return watchItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  };

  const onSubmit = async (data: BillFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create a bill.' });
      return;
    }

    setIsSubmitting(true);
    const billTotal = calculateTotal();
    
    if (data.items.some(item => !item.productId || item.quantity <= 0)) {
        toast({ variant: 'destructive', title: 'Invalid Items', description: 'Please ensure all items have a product selected and quantity is positive.' });
        setIsSubmitting(false);
        return;
    }

    // Validate inventory
    for (const item of data.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        toast({ variant: 'destructive', title: 'Inventory Error', description: `Not enough stock for ${item.name}. Available: ${product?.quantity ?? 0}.` });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const billForFirestore: Omit<Bill, 'id'> = {
        userId: user.uid,
        customerName: data.customerName || 'Walk-in Customer',
        items: data.items,
        total: billTotal,
        createdAt: new Date(),
      };

      const docRef = await addBill(billForFirestore);

      const newBill: Bill = {
        id: docRef.id,
        ...billForFirestore,
      };

      // Update inventory in parallel in DB and update store
      const updatePromises = data.items.map(item => {
        updateProductQuantity(item.productId, -item.quantity); // update local store
        return updateProductQuantityInDB(item.productId, item.quantity); // update database
      });
      await Promise.all(updatePromises);

      toast({ title: 'Success', description: 'Bill created. Downloading PDF invoice...' });
      
      generateInvoicePdf(newBill);

      router.push('/dashboard');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create bill.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-64">Please log in to create bills.</div>;
  }

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          placeholder="Customer Name (optional)"
          {...register('customerName')}
          className="max-w-sm"
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                const item = watchItems[index];
                const subtotal = (item?.price || 0) * (item?.quantity || 1);
                return (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Select onValueChange={(value) => handleProductChange(index, value)} defaultValue={item.productId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingProducts ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                            products.map((p) => (
                              <SelectItem key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                {p.name} ({p.quantity} left)
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>₹{item?.price?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>₹{subtotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ productId: '', name: '', quantity: 1, price: 0 })}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>

        <div className="flex justify-end pt-4 border-t">
          <div className="text-right space-y-2">
            <p className="text-lg font-semibold">
              Grand Total: <span className="font-bold text-primary text-xl">₹{calculateTotal().toFixed(2)}</span>
            </p>
            <Button type="submit" size="lg" disabled={isSubmitting || watchItems.some(item => !item.productId)}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Download className="mr-2 h-4 w-4" /> Save &amp; Download PDF</>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
