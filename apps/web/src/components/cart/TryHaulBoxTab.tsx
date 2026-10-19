"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Box,
  ArrowRight,
  Clock,
  CheckCircle2,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { useDualCartStore } from "../../stores/useDualCartStore";
import { ProductSize } from "../../types/try-haul";

export function TryHaulBoxTab() {
  const items = useDualCartStore((s) => s.tryHaulBox);
  const maxCapacity = useDualCartStore((s) => s.maxHaulCapacity);
  const removeItem = useDualCartStore((s) => s.removeFromTryHaulBox);
  const addBackupSize = useDualCartStore((s) => s.addBackupSizeToHaul);
  const closeDrawer = useDualCartStore((s) => s.closeDrawer);

  const [backupSizeFeedback, setBackupSizeFeedback] = useState<string | null>(null);

  const isFull = items.length >= maxCapacity;
  const capacityPercent = Math.round((items.length / maxCapacity) * 100);

  // Helper to suggest next adjacent size for a product
  const getSuggestedBackupSize = (currentSize: ProductSize, availableSizes: ProductSize[]): ProductSize | null => {
    const sizeOrder: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];
    const currentIndex = sizeOrder.indexOf(currentSize);

    const nextUp = sizeOrder[currentIndex + 1];
    if (nextUp && availableSizes.includes(nextUp)) return nextUp;

    const nextDown = sizeOrder[currentIndex - 1];
    if (nextDown && availableSizes.includes(nextDown)) return nextDown;

    return null;
  };

  const handleAddBackup = (primaryItemId: string, size: ProductSize) => {
    const result = addBackupSize(primaryItemId, size);
    if (!result.success && result.error) {
      setBackupSizeFeedback(result.error);
      setTimeout(() => setBackupSizeFeedback(null), 3000);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAF9F6]">
        <div className="w-12 h-12 border border-[#E5E5E0] flex items-center justify-center text-[#15803D] mb-4 bg-white">
          <Box className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#111111] mb-1">
          Your Try at Home Box is Empty
        </h3>
        <p className="text-xs text-[#666666] max-w-xs mb-6 leading-relaxed">
          Select up to 5 items to try on at home for 20 minutes before paying for clothes.
        </p>
        <button
          onClick={closeDrawer}
          className="px-6 py-3 rounded-none bg-[#111111] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#333333] transition-colors"
        >
          Explore Eligible Garments
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between bg-[#FFFFFF]">
      {/* Capacity Progress Meter */}
      <div className="p-4 bg-[#F4F4F0] border-b border-[#E5E5E0] text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-[#111111] uppercase tracking-[0.15em] text-[11px]">
            Try at Home Box — {items.length} of {maxCapacity} items selected
          </span>
          <span className="text-xs font-semibold text-[#111111] tabular-nums">
            {items.length}/{maxCapacity}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E5E5E0] h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isFull ? "bg-[#B45309]" : "bg-[#15803D]"
            }`}
            style={{ width: `${capacityPercent}%` }}
          />
        </div>

        {isFull ? (
          <p className="text-[11px] text-[#B45309] mt-2 flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Box is at full capacity (5 items). Remove an item to add another.</span>
          </p>
        ) : (
          <p className="text-[11px] text-[#666666] mt-1.5">
            You can add <strong className="text-[#111111] font-medium">{maxCapacity - items.length} more garments</strong> or backup sizes for ₹0 upfront.
          </p>
        )}
      </div>

      {backupSizeFeedback && (
        <div className="mx-4 mt-2 p-2.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[11px]">
          {backupSizeFeedback}
        </div>
      )}

      {/* Item list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-[#E5E5E0]">
        {items.map((item) => {
          const hasBackupAlready = items.some(
            (b) => b.parentItemId === item.id || (item.isBackupSize && b.id === item.parentItemId)
          );
          const suggestedBackupSize = !hasBackupAlready && !item.isBackupSize
            ? getSuggestedBackupSize(item.selectedSize, item.product.sizes)
            : null;

          return (
            <div key={item.id} className="pt-4 first:pt-0 space-y-3">
              <div className="flex gap-3 sm:gap-4">
                <Link
                  href={`/shop/${item.productId}`}
                  onClick={closeDrawer}
                  className="relative w-16 h-24 sm:w-20 sm:h-28 bg-[#FAF9F6] shrink-0 border border-[#E5E5E0] overflow-hidden group"
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.isBackupSize && (
                    <div className="absolute top-0 left-0 px-1.5 py-0.5 text-[8px] font-bold uppercase bg-[#111111] text-white tracking-wider">
                      Backup
                    </div>
                  )}
                </Link>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/shop/${item.productId}`}
                          onClick={closeDrawer}
                          className="text-xs font-semibold uppercase tracking-wider text-[#111111] hover:underline truncate block"
                        >
                          {item.product.name}
                        </Link>
                        {item.isBackupSize && (
                          <span className="text-[10px] text-[#15803D] font-medium block mt-0.5">
                            Free backup size to compare fit
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#888888] hover:text-[#111111] transition-colors p-1"
                        title={item.isBackupSize ? "Remove backup size" : "Remove item"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#666666] mt-1">
                      Color: {item.selectedColor} • Size: {item.selectedSize}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#15803D]">
                      <CheckCircle2 className="w-3 h-3" />
                      ₹0 Now
                    </span>

                    <div className="text-right">
                      <div className="text-xs font-medium text-[#111111] tabular-nums">
                        MRP ₹{item.product.price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-[#888888]">
                        Pay only if you keep
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* One-click backup size prompt banner */}
              {suggestedBackupSize && !isFull && (
                <div className="p-2.5 bg-[#FAF9F6] border border-[#E5E5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] text-[#333333]">
                    <span className="font-medium text-[#111111]">Not sure about fit?</span>
                    <span className="block text-[#666666] text-[10px]">
                      Add size {suggestedBackupSize} as a free backup to compare.
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddBackup(item.id, suggestedBackupSize)}
                    className="px-2.5 py-1.5 rounded-none bg-[#111111] hover:bg-[#333333] text-white text-[10px] font-medium uppercase tracking-wider flex items-center gap-1 self-start sm:self-auto shrink-0 transition-colors"
                  >
                    <PlusCircle className="w-3 h-3" />
                    + Size {suggestedBackupSize}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer fee breakdown */}
      <div className="p-4 sm:p-5 bg-[#FAF9F6] border-t border-[#E5E5E0] space-y-3">
        <div className="p-3 bg-white border border-[#E5E5E0] space-y-2 text-xs">
          <div className="flex justify-between text-[#666666]">
            <span>Pay Now for Clothes</span>
            <span className="text-[#15803D] font-semibold tabular-nums">₹0.00</span>
          </div>
          <div className="flex justify-between text-[#666666]">
            <span>Refundable Home Trial Deposit</span>
            <span className="text-[#111111] font-medium tabular-nums">₹199</span>
          </div>
          <div className="flex justify-between text-[#666666]">
            <span>Home Trial Duration</span>
            <span className="text-[#111111] flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" /> 20 Minutes
            </span>
          </div>
          <div className="pt-2 border-t border-[#E5E5E0] flex justify-between text-sm font-semibold text-[#111111]">
            <span>Pay Now to Book Trial</span>
            <span className="text-base tabular-nums">₹199</span>
          </div>
        </div>

        <p className="text-[11px] text-[#666666] leading-relaxed">
          Try up to 5 items at home for 20 minutes. Pay ₹199 now to book the rider (100% adjusted if you buy anything, or refunded if you return everything).
        </p>

        <Link
          href="/checkout?mode=TRY_HAUL"
          onClick={closeDrawer}
          className="w-full py-4 rounded-none bg-[#111111] hover:bg-[#333333] text-white font-medium text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
        >
          <span>Continue to Trial Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
