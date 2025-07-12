
import { create } from 'zustand';
import type { Product } from '@/types';
import { getProducts } from '@/lib/firebase/firestore';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (userId: string) => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProductQuantity: (productId: string, quantityChange: number) => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async (userId: string) => {
    // Only fetch if products aren't already loaded
    if (get().products.length > 0 || get().loading) {
      return;
    }
    set({ loading: true, error: null });
    try {
      const products = await getProducts(userId);
      set({ products, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products.', loading: false });
    }
  },
  addProduct: (product) => {
    set((state) => ({
      products: [...state.products, product].sort((a, b) => a.name.localeCompare(b.name)),
    }));
  },
  updateProduct: (updatedProduct) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ).sort((a, b) => a.name.localeCompare(b.name)),
    }));
  },
  deleteProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    }));
  },
  updateProductQuantity: (productId: string, quantityChange: number) => {
    set((state) => ({
        products: state.products.map((p) => 
            p.id === productId ? {...p, quantity: p.quantity + quantityChange} : p
        )
    }));
  },
  clearProducts: () => {
    set({ products: [], loading: false, error: null });
  }
}));
