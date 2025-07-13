import { db } from './config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, limit, increment, getCountFromServer, where, type DocumentReference } from 'firebase/firestore';
import type { Product, Bill } from '@/types';

// Products collection
const getProductsCollection = () => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  return collection(db, 'products');
};

export const getProducts = async (userId: string): Promise<Product[]> => {
  try {
    const productsCollection = getProductsCollection();
    const snapshot = await getDocs(query(productsCollection, where('userId', '==', userId), orderBy('name')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error: any) {
    // Fallback: if index doesn't exist, get all products and filter client-side
    if (error.code === 'failed-precondition' || error.message.includes('index')) {
      console.warn('Index not found for products query, falling back to client-side filtering');
      const productsCollection = getProductsCollection();
      const snapshot = await getDocs(productsCollection);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Product))
        .filter(product => product.userId === userId)
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    throw error;
  }
};

export const getProductCount = async (userId: string): Promise<number> => {
  const productsCollection = getProductsCollection();
  const snapshot = await getDocs(query(productsCollection, where('userId', '==', userId)));
  // Sum the quantity of each product to get the total number of items in stock
  return snapshot.docs.reduce((acc, doc) => acc + (doc.data().quantity || 0), 0);
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const productsCollection = getProductsCollection();
  return await addDoc(productsCollection, product);
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  const productDoc = doc(db, 'products', id);
  return await updateDoc(productDoc, product);
};

export const deleteProduct = async (id: string) => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  const productDoc = doc(db, 'products', id);
  return await deleteDoc(productDoc);
};

// Use Firestore's atomic increment to safely update quantity
export const updateProductQuantity = async (productId: string, quantitySold: number) => {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized');
    }
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { 
        quantity: increment(-quantitySold) 
    });
};

// Bills collection
const getBillsCollection = () => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  return collection(db, 'bills');
};

export const getBills = async (userId: string, count?: number): Promise<Bill[]> => {
  try {
    const billsCollection = getBillsCollection();
    const billsQuery = count 
      ? query(billsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(count))
      : query(billsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(billsQuery);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date
        } as Bill
    });
  } catch (error: any) {
    // Fallback: if index doesn't exist, get all bills and filter client-side
    if (error.code === 'failed-precondition' || error.message.includes('index')) {
      console.warn('Index not found for bills query, falling back to client-side filtering');
      const billsCollection = getBillsCollection();
      const snapshot = await getDocs(billsCollection);
      let bills = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
          } as Bill;
        })
        .filter(bill => bill.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      // Apply limit if specified
      if (count) {
        bills = bills.slice(0, count);
      }
      
      return bills;
    }
    throw error;
  }
};

export const getBillCount = async (userId: string): Promise<number> => {
  const billsCollection = getBillsCollection();
  const snapshot = await getCountFromServer(query(billsCollection, where('userId', '==', userId)));
  return snapshot.data().count;
}

export const getTotalSales = async (userId: string): Promise<number> => {
  const billsCollection = getBillsCollection();
  const snapshot = await getDocs(query(billsCollection, where('userId', '==', userId)));
  return snapshot.docs.reduce((acc, doc) => acc + doc.data().total, 0);
};

export const addBill = async (bill: Omit<Bill, 'id'>): Promise<DocumentReference> => {
  const billsCollection = getBillsCollection();
  return await addDoc(billsCollection, bill);
};
