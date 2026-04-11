import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmSize?: string;
  crops?: string[];
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: User = {
  id: "demo-user-1",
  name: "Arjun Patel",
  email: "arjun@greenwatch.app",
  phone: "+91 98765 43210",
  location: "Ahmedabad, Gujarat",
  farmSize: "5 acres",
  crops: ["Wheat", "Cotton", "Groundnut"],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await AsyncStorage.getItem("auth_token");
      const storedUser = await AsyncStorage.getItem("auth_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setError(null);
    try {
      if (!email || !password) throw new Error("Please enter email and password");
      const mockToken = "mock-jwt-token-" + Date.now();
      const mockUser = { ...DEMO_USER, email };
      await AsyncStorage.setItem("auth_token", mockToken);
      await AsyncStorage.setItem("auth_user", JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setError(msg);
      throw new Error(msg);
    }
  }

  async function register(data: RegisterData) {
    setError(null);
    try {
      if (!data.name || !data.email || !data.password) {
        throw new Error("All fields are required");
      }
      const mockToken = "mock-jwt-token-" + Date.now();
      const newUser: User = {
        id: "user-" + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
      };
      await AsyncStorage.setItem("auth_token", mockToken);
      await AsyncStorage.setItem("auth_user", JSON.stringify(newUser));
      setToken(mockToken);
      setUser(newUser);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      setError(msg);
      throw new Error(msg);
    }
  }

  async function logout() {
    await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
    setToken(null);
    setUser(null);
  }

  async function updateProfile(data: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...data };
    await AsyncStorage.setItem("auth_user", JSON.stringify(updated));
    setUser(updated);
  }

  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateProfile,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
