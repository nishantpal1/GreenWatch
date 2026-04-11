import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeData(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getData<T>(key: string): Promise<T | null> {
  const val = await AsyncStorage.getItem(key);
  if (!val) return null;
  return JSON.parse(val) as T;
}

export async function removeData(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
