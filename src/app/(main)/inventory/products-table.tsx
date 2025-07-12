"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addProduct as addProductToDB, updateProduct as updateProductInDB, deleteProduct as deleteProductFromDB } from '@/lib/firebase/firestore';
import type { Product } from '@/types';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useProductStore } from '@/hooks/use-product-store';
import { useAuth } from '@/hooks/use-auth';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  quantity: z.coerce.number().min(0, 'Quantity must be a positive number.'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductsTable() {
  const { user } = useAuth();
  const { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct, clearProducts } = useProductStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      quantity: 0,
    },
  });

  useEffect(() => {
    if (user) {
      fetchProducts(user.uid);
    } else {
      clearProducts();
    }
  }, [fetchProducts, user, clearProducts]);

  const handleDialogOpen = (product: Product | null = null) => {
    setEditingProduct(product);
    if (product) {
      form.reset({ name: product.name, price: product.price, quantity: product.quantity });
    } else {
      form.reset({ name: '', price: 0, quantity: 0 });
    }
    setDialogOpen(true);
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to perform this action.' });
      return;
    }

    try {
      if (editingProduct) {
        const updatedProductData = { ...editingProduct, ...values };
        await updateProductInDB(editingProduct.id, values);
        updateProduct(updatedProductData); // Update local store
        toast({ title: 'Success', description: 'Product updated successfully.' });
      } else {
        const newProductData = { ...values, userId: user.uid };
        const newProductRef = await addProductToDB(newProductData);
        addProduct({ id: newProductRef.id, ...newProductData }); // Update local store
        toast({ title: 'Success', description: 'Product added successfully.' });
      }
      setDialogOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save product.' });
    } finally {
        // This is crucial to re-enable the button
        form.control._reset();
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProductFromDB(productId);
      deleteProduct(productId); // Update local store
      toast({ title: 'Success', description: 'Product deleted successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete product.' });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
  }, [products, filter]);

  if (!user) {
    return <div className="flex justify-center items-center h-64">Please log in to view your inventory.</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <Input
          placeholder="Filter products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogOpen()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="quantity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Quantity</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : 'Save'}
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product "{product.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
