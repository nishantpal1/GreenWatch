import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, SAMPLE_PRODUCTS } from "@/lib/mockData";

interface MarketplaceContextValue {
  products: Product[];
  myProducts: Product[];
  addProduct: (product: Omit<Product, "id" | "postedDate">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
  filteredProducts: Product[];
  isLoading: boolean;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    try {
      const stored = await AsyncStorage.getItem("marketplace_products");
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        setProducts([...SAMPLE_PRODUCTS, ...parsed]);
      } else {
        setProducts(SAMPLE_PRODUCTS);
      }
    } catch {
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveUserProducts(userProds: Product[]) {
    await AsyncStorage.setItem("marketplace_products", JSON.stringify(userProds));
  }

  const myProducts = products.filter(p => p.id.startsWith("user-prod-"));

  async function addProduct(data: Omit<Product, "id" | "postedDate">) {
    const newProd: Product = {
      ...data,
      id: "user-prod-" + Date.now(),
      postedDate: "Just now",
    };
    const updated = [...products, newProd];
    const userProds = updated.filter(p => p.id.startsWith("user-prod-"));
    await saveUserProducts(userProds);
    setProducts(updated);
  }

  async function updateProduct(id: string, data: Partial<Product>) {
    const updated = products.map(p => p.id === id ? { ...p, ...data } : p);
    const userProds = updated.filter(p => p.id.startsWith("user-prod-"));
    await saveUserProducts(userProds);
    setProducts(updated);
  }

  async function deleteProduct(id: string) {
    const updated = products.filter(p => p.id !== id);
    const userProds = updated.filter(p => p.id.startsWith("user-prod-"));
    await saveUserProducts(userProds);
    setProducts(updated);
  }

  const filteredProducts = products.filter(p => {
    const matchSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        myProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        userId,
        setUserId,
        filteredProducts,
        isLoading,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return ctx;
}
