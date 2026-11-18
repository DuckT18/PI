"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Device } from "@/data/mockData";

export const MAX_FAVORITES = 4;
const FAVORITES_STORAGE_KEY = "automate_favorite_devices";
const FAVORITES_EVENT = "automate-favorites-changed";

export function getStoredFavoriteIds(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((id): id is string => typeof id === "string")
        .slice(0, MAX_FAVORITES);
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredFavoriteIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    const limited = Array.from(new Set(ids)).slice(0, MAX_FAVORITES);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(limited));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: limited }));
  } catch {
    // ignore storage errors
  }
}

export function markNewDeviceAsFavorite(deviceId: string) {
  const current = getStoredFavoriteIds() ?? [];
  const withoutCurrent = current.filter((id) => id !== deviceId);
  const next =
    withoutCurrent.length >= MAX_FAVORITES
      ? [...withoutCurrent.slice(0, MAX_FAVORITES - 1), deviceId]
      : [...withoutCurrent, deviceId];
  setStoredFavoriteIds(next);
}

function subscribeFavorites(callback: () => void) {
  window.addEventListener(FAVORITES_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(FAVORITES_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getFavoritesSnapshot(): string | null {
  try {
    return localStorage.getItem(FAVORITES_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function useFavorites(devices: Device[] | null | undefined) {
  const rawStored = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    () => null,
  );
  const [limitWarning, setLimitWarning] = useState<string | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storedIds = useMemo<string[] | null>(() => {
    if (rawStored === null) return null;
    try {
      const parsed = JSON.parse(rawStored);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((id): id is string => typeof id === "string")
          .slice(0, MAX_FAVORITES);
      }
      return null;
    } catch {
      return null;
    }
  }, [rawStored]);

  useEffect(() => {
    if (!devices || devices.length === 0) return;
    if (storedIds === null) {
      const initial = devices.slice(0, MAX_FAVORITES).map((d) => d.id);
      setStoredFavoriteIds(initial);
      return;
    }
    // Limpa IDs que não existem mais na lista atual de dispositivos
    const validIds = storedIds.filter((id) => devices.some((d) => d.id === id));
    if (validIds.length !== storedIds.length) {
      setStoredFavoriteIds(validIds);
    }
  }, [devices, storedIds]);

  useEffect(() => {
    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, []);

  const validFavoriteIds = useMemo(() => {
    if (!devices) return (storedIds ?? []).slice(0, MAX_FAVORITES);
    if (storedIds === null) {
      return devices.slice(0, MAX_FAVORITES).map((d) => d.id);
    }
    const deviceIdSet = new Set(devices.map((d) => d.id));
    return storedIds
      .filter((id) => deviceIdSet.has(id))
      .slice(0, MAX_FAVORITES);
  }, [devices, storedIds]);

  const favoriteDevices = useMemo(() => {
    if (!devices) return [];
    return validFavoriteIds
      .map((id) => devices.find((d) => d.id === id))
      .filter((d): d is Device => Boolean(d));
  }, [devices, validFavoriteIds]);

  const toggleFavorite = useCallback(
    (deviceId: string) => {
      const current = validFavoriteIds;
      if (current.includes(deviceId)) {
        const next = current.filter((id) => id !== deviceId);
        setStoredFavoriteIds(next);
        setLimitWarning(null);
        return;
      }

      if (current.length >= MAX_FAVORITES) {
        setLimitWarning(
          "Máximo de 4 favoritos atingido. Desmarque um card para adicionar outro.",
        );
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        warningTimerRef.current = setTimeout(() => {
          setLimitWarning(null);
        }, 3000);
        return;
      }

      const next = [...current, deviceId];
      setStoredFavoriteIds(next);
      setLimitWarning(null);
    },
    [validFavoriteIds],
  );

  return {
    favoriteIds: validFavoriteIds,
    favoriteDevices,
    toggleFavorite,
    limitWarning,
  };
}
