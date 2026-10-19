export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type ProductCategory =
  | "all"
  | "outerwear"
  | "knitwear"
  | "t-shirts"
  | "trousers"
  | "accessories";

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
  inStock: boolean;
}

export interface ProductInventoryVariant {
  size: ProductSize;
  color: string;
  sku: string;
  stockCount: number; // 0 = Out of Stock, 1-3 = Low Stock, >3 = Plentiful
}

export interface LuxuryProduct {
  id: string;
  sku: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // In INR (e.g. 18500 = ₹18,500)
  compareAtPrice?: number;
  category: ProductCategory;
  isTryHaulEligible: boolean;
  images: [string, string, ...string[]]; // At least 2 images for primary & hover states
  sizes: ProductSize[];
  colors: ColorVariant[];
  inventory: ProductInventoryVariant[];
  rating: number;
  reviewCount: number;
  materialComposition: string;
  careInstructions: string;
}

// ================= CART DOMAIN =================

export interface StandardBagItem {
  id: string;
  productId: string;
  product: LuxuryProduct;
  selectedSize: ProductSize;
  selectedColor: string;
  quantity: number;
}

export interface TryHaulItem {
  id: string;
  productId: string;
  product: LuxuryProduct;
  selectedSize: ProductSize;
  selectedColor: string;
  isBackupSize?: boolean;
  parentItemId?: string; // Links complimentary backup sizes to primary item
}

export interface DualCartState {
  standardBag: StandardBagItem[];
  tryHaulBox: TryHaulItem[];
  maxHaulCapacity: number; // Configurable limit (e.g. 5 items)
  activeTab: "BUY_NOW" | "TRY_HAUL";
  isDrawerOpen: boolean;
  hasHydrated: boolean;

  // Actions
  setHasHydrated: (val: boolean) => void;
  addToStandardBag: (item: Omit<StandardBagItem, "id">) => void;
  addToTryHaulBox: (
    item: Omit<TryHaulItem, "id">
  ) => { success: boolean; itemId?: string; error?: string };
  addBackupSizeToHaul: (
    primaryItemId: string,
    backupSize: ProductSize
  ) => { success: boolean; error?: string };
  removeFromStandardBag: (id: string) => void;
  removeFromTryHaulBox: (id: string) => void;
  updateStandardQuantity: (id: string, qty: number) => void;
  setActiveTab: (tab: "BUY_NOW" | "TRY_HAUL") => void;
  openDrawer: (tab?: "BUY_NOW" | "TRY_HAUL") => void;
  closeDrawer: () => void;
  clearCart: (mode?: "BUY_NOW" | "TRY_HAUL") => void;
}

// ================= DOORSTEP TRIAL STATE MACHINE =================

export type TrialDecision =
  | "PENDING_TRIAL"
  | "KEEP"
  | "RETURN"
  | "EXCHANGE_REQUESTED";

export interface ExchangeSpecification {
  newSize: ProductSize;
  newColor: string;
  dispatchPreference: "IMMEDIATE_DISPATCH" | "HOLD_FOR_NEXT_DELIVERY";
  priceLocked: boolean;
}

export interface TryHaulOrderItem {
  id: string;
  productId: string;
  product: LuxuryProduct;
  size: ProductSize;
  color: string;
  price: number;
  isBackupSize?: boolean;
  parentItemId?: string;
  decision: TrialDecision;
  exchangeDetails?: ExchangeSpecification;
}

export type TryHaulOrderStatus =
  | "DISPATCHED"
  | "ARRIVED_AT_DOORSTEP"
  | "TRIAL_IN_PROGRESS"
  | "SETTLEMENT_PENDING"
  | "COMPLETED_HANDOVER"
  | "CANCELLED";

export interface TryHaulOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  deliveryPartner: {
    name: string;
    phone: string;
    rating: number;
    vehicleNumber: string;
    arrivedAt: string;
  };
  trialDurationMinutes: number; // e.g. 20 minutes
  trialExpiresAt: string; // ISO string
  status: TryHaulOrderStatus;
  items: TryHaulOrderItem[];
  trialConvenienceDeposit: number; // e.g. 199 = ₹199 (refundable/adjusted)
  handoverOtp: string; // 4-digit code (e.g. "8419")
}

export interface DoorstepSettlementCalculation {
  keptTotal: number;
  lockedExchangeTotal: number;
  grossPayable: number;
  depositCredit: number;
  depositApplied: number;
  netPayableToRider: number;
  depositRefundStatus: "APPLIED_TO_BILL" | "FULL_REFUND_DUE" | "RETAINED_PER_POLICY";
}
