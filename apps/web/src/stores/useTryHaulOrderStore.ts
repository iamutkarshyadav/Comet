import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import {
  TryHaulOrder,
  TrialDecision,
  ExchangeSpecification,
  DoorstepSettlementCalculation,
} from "../types/try-haul";
import { LUXURY_CATALOG } from "../data/catalog";

interface TryHaulOrderStoreState {
  currentOrder: TryHaulOrder | null;
  hasHydrated: boolean;
  timeRemainingSeconds: number; // For live 20:00 timer

  // Actions
  setHasHydrated: (val: boolean) => void;
  initializeDemoOrder: (orderId?: string) => void;
  setOrder: (order: TryHaulOrder) => void;
  setTimeRemaining: (sec: number) => void;
  decrementTimer: () => void;
  setItemDecision: (
    itemId: string,
    decision: TrialDecision,
    exchangeDetails?: ExchangeSpecification
  ) => void;
  bulkSetDecision: (decision: "KEEP" | "RETURN") => void;
  completeHandover: () => void;
  getSettlement: () => DoorstepSettlementCalculation;
}

// Generate default mock order if none exists
const createDefaultDemoOrder = (id = "ORD-TH-8921"): TryHaulOrder => {
  const trench = LUXURY_CATALOG[0];
  const knit = LUXURY_CATALOG[1];
  const trouser = LUXURY_CATALOG[2];

  return {
    id,
    orderNumber: "TH-2026-DEL-8921",
    customer: {
      name: "Rohit Malhotra",
      phone: "+91 98112 45890",
      address: "Phoenix House, Villa 4, Golf Links",
      city: "New Delhi",
      pincode: "110003",
    },
    deliveryPartner: {
      name: "Rahul Sharma",
      phone: "+91 98711 02934",
      rating: 4.96,
      vehicleNumber: "DL-3S-EQ-8821 (Phoenix EV)",
      arrivedAt: new Date().toISOString(),
    },
    trialDurationMinutes: 20,
    trialExpiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    status: "ARRIVED_AT_DOORSTEP",
    trialConvenienceDeposit: 199, // ₹199 trial fee
    handoverOtp: "8419",
    items: [
      {
        id: "haul-item-1",
        productId: trench.id,
        product: trench,
        size: "M",
        color: "Oatmeal Melange",
        price: trench.price,
        decision: "PENDING_TRIAL",
      },
      {
        id: "haul-item-1-backup",
        productId: trench.id,
        product: trench,
        size: "L",
        color: "Oatmeal Melange",
        price: trench.price,
        isBackupSize: true,
        parentItemId: "haul-item-1",
        decision: "PENDING_TRIAL",
      },
      {
        id: "haul-item-2",
        productId: knit.id,
        product: knit,
        size: "M",
        color: "Raw Ecru",
        price: knit.price,
        decision: "PENDING_TRIAL",
      },
      {
        id: "haul-item-3",
        productId: trouser.id,
        product: trouser,
        size: "M",
        color: "Charcoal Heather",
        price: trouser.price,
        decision: "PENDING_TRIAL",
      },
    ],
  };
};

export const useTryHaulOrderStore = create<TryHaulOrderStoreState>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      hasHydrated: false,
      timeRemainingSeconds: 20 * 60, // 20:00

      setHasHydrated: (val) => set({ hasHydrated: val }),

      initializeDemoOrder: (orderId) => {
        const order = createDefaultDemoOrder(orderId);
        set({
          currentOrder: order,
          timeRemainingSeconds: 20 * 60,
        });
      },

      setOrder: (order) =>
        set({
          currentOrder: order,
          timeRemainingSeconds: order.trialDurationMinutes * 60,
        }),

      setTimeRemaining: (sec) => set({ timeRemainingSeconds: sec }),

      decrementTimer: () =>
        set((s) => ({
          timeRemainingSeconds: Math.max(0, s.timeRemainingSeconds - 1),
        })),

      // Architectural Refinement 1: Backup Size Mutual Exclusion on Keep
      setItemDecision: (itemId, decision, exchangeDetails) => {
        set((state) => {
          if (!state.currentOrder) return state;

          const targetItem = state.currentOrder.items.find((i) => i.id === itemId);
          if (!targetItem) return state;

          const updatedItems = state.currentOrder.items.map((item) => {
            // Apply decision to target item
            if (item.id === itemId) {
              return {
                ...item,
                decision,
                exchangeDetails: decision === "EXCHANGE_REQUESTED" ? exchangeDetails : undefined,
              };
            }

            // Mutual exclusion: If target is marked KEEP, automatically set counterpart backup/primary to RETURN
            if (decision === "KEEP") {
              const isCounterpart =
                (item.parentItemId === itemId && item.isBackupSize) ||
                (targetItem.parentItemId === item.id && targetItem.isBackupSize) ||
                (item.productId === targetItem.productId && item.id !== targetItem.id && (item.isBackupSize || targetItem.isBackupSize));

              if (isCounterpart) {
                return {
                  ...item,
                  decision: "RETURN" as TrialDecision,
                  exchangeDetails: undefined,
                };
              }
            }

            return item;
          });

          return {
            currentOrder: {
              ...state.currentOrder,
              items: updatedItems,
            },
          };
        });
      },

      // Bulk actions
      bulkSetDecision: (decision) => {
        set((state) => {
          if (!state.currentOrder) return state;

          if (decision === "RETURN") {
            const returned = state.currentOrder.items.map((i) => ({
              ...i,
              decision: "RETURN" as TrialDecision,
              exchangeDetails: undefined,
            }));
            return { currentOrder: { ...state.currentOrder, items: returned } };
          }

          // When bulk keeping, honor mutual exclusion so user doesn't buy both sizes
          const keptMap = new Set<string>();
          const kept = state.currentOrder.items.map((item) => {
            if (keptMap.has(item.productId)) {
              return {
                ...item,
                decision: "RETURN" as TrialDecision,
                exchangeDetails: undefined,
              };
            }

            keptMap.add(item.productId);
            return {
              ...item,
              decision: "KEEP" as TrialDecision,
              exchangeDetails: undefined,
            };
          });

          return { currentOrder: { ...state.currentOrder, items: kept } };
        });
      },

      completeHandover: () => {
        set((state) => {
          if (!state.currentOrder) return state;
          return {
            currentOrder: {
              ...state.currentOrder,
              status: "COMPLETED_HANDOVER",
            },
          };
        });
      },

      // Architectural Refinement 2: Non-Negative Clamped Settlement Math
      getSettlement: () => {
        const order = get().currentOrder;
        if (!order) {
          return {
            keptTotal: 0,
            lockedExchangeTotal: 0,
            grossPayable: 0,
            depositCredit: 199,
            depositApplied: 0,
            netPayableToRider: 0,
            depositRefundStatus: "FULL_REFUND_DUE",
          };
        }

        const keptTotal = order.items
          .filter((i) => i.decision === "KEEP")
          .reduce((sum, i) => sum + i.price, 0);

        const lockedExchangeTotal = order.items
          .filter(
            (i) =>
              i.decision === "EXCHANGE_REQUESTED" &&
              i.exchangeDetails?.dispatchPreference === "IMMEDIATE_DISPATCH" &&
              i.exchangeDetails?.priceLocked
          )
          .reduce((sum, i) => sum + i.price, 0);

        const grossPayable = keptTotal + lockedExchangeTotal;
        const depositCredit = order.trialConvenienceDeposit;

        let depositApplied = 0;
        let netPayableToRider = 0;
        let depositRefundStatus: "APPLIED_TO_BILL" | "FULL_REFUND_DUE" | "RETAINED_PER_POLICY" =
          "FULL_REFUND_DUE";

        if (grossPayable > 0) {
          depositApplied = Math.min(depositCredit, grossPayable);
          netPayableToRider = Math.max(0, grossPayable - depositCredit);
          depositRefundStatus =
            depositCredit > grossPayable ? "FULL_REFUND_DUE" : "APPLIED_TO_BILL";
        } else {
          depositApplied = 0;
          netPayableToRider = 0;
          depositRefundStatus = "FULL_REFUND_DUE";
        }

        return {
          keptTotal,
          lockedExchangeTotal,
          grossPayable,
          depositCredit,
          depositApplied,
          netPayableToRider,
          depositRefundStatus,
        };
      },
    }),
    {
      name: "phoenix-try-haul-order-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// SSR Hydration safety hook for Next.js
export function useHydratedTryHaulStore<T>(
  selector: (state: TryHaulOrderStoreState) => T,
  fallback: T
): T {
  return useSyncExternalStore(
    useTryHaulOrderStore.subscribe,
    () => selector(useTryHaulOrderStore.getState()),
    () => fallback
  );
}
