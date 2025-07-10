"use client";

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | null) => void] {
  const isClient = typeof window !== 'undefined';

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | null) => {
    try {
      if (value === null) {
          if (isClient) {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
          }
          return;
      }
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, isClient, storedValue, initialValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          console.error(`Error parsing storage change for key “${key}”:`, error);
          setStoredValue(initialValue);
        }
      }
    };

    if(isClient) {
        window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      if(isClient) {
          window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [key, initialValue, isClient]);

  return [storedValue, setValue];
}

export default useLocalStorage;
