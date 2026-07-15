/**
 * Resilient key/value storage. Prefers AsyncStorage, but if its native module
 * isn't linked (e.g. a mismatched Expo Go build → "Native module is null"),
 * it falls back to in-memory storage so the app still runs instead of crashing.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const memory = new Map<string, string>();
let useMemory = false;

export async function getItem(key: string): Promise<string | null> {
  if (useMemory) return memory.get(key) ?? null;
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    useMemory = true;
    return memory.get(key) ?? null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (useMemory) {
    memory.set(key, value);
    return;
  }
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    useMemory = true;
    memory.set(key, value);
  }
}
