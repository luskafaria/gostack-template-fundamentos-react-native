import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
  loading: boolean;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const productsList = await AsyncStorage.getItem('@GoStore');

      setProducts(productsList ? JSON.parse(productsList) : []);
    }

    loadProducts();
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   async function handleStorage(): Promise<void> {
  //     await AsyncStorage.setItem('@GoStore', JSON.stringify(products));
  //   }

  //   handleStorage();
  // }, [products]);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART
      const productAlreadyAdded = !!products.find(
        item => item.id === product.id,
      );

      if (productAlreadyAdded) {
        const updatedCart = products.map(item => {
          return item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });

        setProducts(updatedCart);
        await AsyncStorage.setItem('@GoStore', JSON.stringify(updatedCart));
      } else {
        const updatedCart = [{ ...product, quantity: 1 }, ...products];
        setProducts(updatedCart);
        await AsyncStorage.setItem('@GoStore', JSON.stringify(updatedCart));
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const newCart = products.map(product => {
        return product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product;
      });

      setProducts(newCart);
      await AsyncStorage.setItem('@GoStore', JSON.stringify(newCart));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const newCart = products
        .map(product => {
          return product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product;
        })
        .filter(product => product.quantity > 0);

      setProducts(newCart);
      await AsyncStorage.setItem('@GoStore', JSON.stringify(newCart));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products, loading }),
    [products, addToCart, increment, decrement, loading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
