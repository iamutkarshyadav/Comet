import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import {
  DualCartState,
  StandardBagItem,
  TryHaulItem,
} from "../types/try-haul";

export const useDualCartStore = create<DualCartState>()(
  persist(
    (set, get) => ({
      standardBag: [],
      tryHaulBox: [],
      maxHaulCapacity: 5,
      activeTab: "BUY_NOW",
      isDrawerOpen: false,
      hasHydrated: false,

      setHasHydrated: (val: boolean) => set({ hasHydrated: val }),

      addToStandardBag: (itemData) => {
        set((state) => {
          const existingIndex = state.standardBag.findIndex(
            (i) =>
              i.productId === itemData.productId &&
              i.selectedSize === itemData.selectedSize &&
              i.selectedColor === itemData.selectedColor
          );

          if (existingIndex > -1) {
            const updated = [...state.standardBag];
            updated[existingIndex].quantity += itemData.quantity;
            return { standardBag: updated, isDrawerOpen: true, activeTab: "BUY_NOW" };
          }

          const newItem: StandardBagItem = {
            ...itemData,
            id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          };

          return {
            standardBag: [...state.standardBag, newItem],
            isDrawerOpen: true,
            activeTab: "BUY_NOW",
          };
        });
      },

      addToTryHaulBox: (itemData) => {
        const state = get();
        if (state.tryHaulBox.length >= state.maxHaulCapacity) {
          return {
            success: false,
            error: `Your Try Haul Box has reached maximum capacity (${state.maxHaulCapacity} garments). Please remove an item before adding another.`,
          };
        }

        // Avoid adding the exact same product + size + color twice
        const alreadyExists = state.tryHaulBox.some(
          (i) =>
            i.productId === itemData.productId &&
            i.selectedSize === itemData.selectedSize &&
            i.selectedColor === itemData.selectedColor
        );

        if (alreadyExists) {
          return {
            success: false,
            error: "This specific size and color is already in your Try Haul Box.",
          };
        }

        const newItem: TryHaulItem = {
          ...itemData,
          id: `haul-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        };

        set((s) => ({
          tryHaulBox: [...s.tryHaulBox, newItem],
          isDrawerOpen: true,
          activeTab: "TRY_HAUL",
        }));

        return { success: true, itemId: newItem.id };
      },

      addBackupSizeToHaul: (primaryItemId, backupSize) => {
        const state = get();
        const primaryItem = state.tryHaulBox.find((i) => i.id === primaryItemId);
        if (!primaryItem) {
          return { success: false, error: "Primary item not found in Haul Box." };
        }

        if (state.tryHaulBox.length >= state.maxHaulCapacity) {
          return {
            success: false,
            error: `Cannot add backup size: Try Haul Box is full (max ${state.maxHaulCapacity} items).`,
          };
        }

        // Check if backup size already exists
        const exists = state.tryHaulBox.some(
          (i) =>
            i.productId === primaryItem.productId &&
            i.selectedSize === backupSize &&
            i.selectedColor === primaryItem.selectedColor
        );

        if (exists) {
          return {
            success: false,
            error: `Size ${backupSize} is already in your Try Haul Box.`,
          };
        }

        const backupItem: TryHaulItem = {
          id: `haul-backup-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          productId: primaryItem.productId,
          product: primaryItem.product,
          selectedSize: backupSize,
          selectedColor: primaryItem.selectedColor,
          isBackupSize: true,
          parentItemId: primaryItem.id,
        };

        set((s) => ({
          tryHaulBox: [...s.tryHaulBox, backupItem],
        }));

        return { success: true };
      },

      removeFromStandardBag: (id) => {
        set((state) => ({
          standardBag: state.standardBag.filter((i) => i.id !== id),
        }));
      },

      // Architectural Refinement 1: Backup Size Cascade Removal
      removeFromTryHaulBox: (id) => {
        set((state) => {
          const targetItem = state.tryHaulBox.find((i) => i.id === id);
          if (!targetItem) return state;

          return {
            tryHaulBox: state.tryHaulBox.filter(
              (item) => item.id !== id && item.parentItemId !== id
            ),
          };
        });
      },

      updateStandardQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeFromStandardBag(id);
          return;
        }
        set((state) => ({
          standardBag: state.standardBag.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i
          ),
        }));
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      openDrawer: (tab) =>
        set((state) => ({
          isDrawerOpen: true,
          activeTab: tab || state.activeTab,
        })),
      closeDrawer: () => set({ isDrawerOpen: false }),

      clearCart: (mode) => {
        if (!mode) {
          set({ standardBag: [], tryHaulBox: [] });
        } else if (mode === "BUY_NOW") {
          set({ standardBag: [] });
        } else {
          set({ tryHaulBox: [] });
        }
      },
    }),
    {
      name: "phoenix-dual-cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// SSR Hydration-safe selector hook using React's useSyncExternalStore
export function useHydratedDualCart<T>(
  selector: (state: DualCartState) => T,
  fallback: T
): T {
  return useSyncExternalStore(
    useDualCartStore.subscribe,
    () => selector(useDualCartStore.getState()),
    () => fallback
  );
}
