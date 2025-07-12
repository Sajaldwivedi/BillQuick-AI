import { db } from './config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, limit, increment, getCountFromServer, type DocumentReference } from 'firebase/firestore';
import type { Product, Bill } from '@/types';

// Products collection
const productsCollection = collection(db, 'products');

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(query(productsCollection, orderBy('name')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const getProductCount = async (): Promise<number> => {
  const snapshot = await getDocs(productsCollection);
  // Sum the quantity of each product to get the total number of items in stock
  return snapshot.docs.reduce((acc, doc) => acc + (doc.data().quantity || 0), 0);
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  return await addDoc(productsCollection, product);
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const productDoc = doc(db, 'products', id);
  return await updateDoc(productDoc, product);
};

export const deleteProduct = async (id: string) => {
  const productDoc = doc(db, 'products', id);
  return await deleteDoc(productDoc);
};

// Use Firestore's atomic increment to safely update quantity
export const updateProductQuantity = async (productId: string, quantitySold: number) => {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { 
        quantity: increment(-quantitySold) 
    });
};

// Bills collection
const billsCollection = collection(db, 'bills');

export const getBills = async (count?: number): Promise<Bill[]> => {
  const billsQuery = count 
    ? query(billsCollection, orderBy('createdAt', 'desc'), limit(count))
    : query(billsCollection, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(billsQuery);
  return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date
      } as Bill
  });
};

export const getBillCount = async (): Promise<number> => {
  const snapshot = await getCountFromServer(billsCollection);
  return snapshot.data().count;
}

export const getTotalSales = async (): Promise<number> => {
  const snapshot = await getDocs(billsCollection);
  return snapshot.docs.reduce((acc, doc) => acc + doc.data().total, 0);
};

export const addBill = async (bill: Omit<Bill, 'id'>): Promise<DocumentReference> => {
  return await addDoc(billsCollection, bill);
};
