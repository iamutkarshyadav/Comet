"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, Truck, Tag, ShieldCheck } from "lucide-react";
import { useDualCartStore } from "../../stores/useDualCartStore";

export function StandardBagTab() {
  const items = useDualCartStore((s) => s.standardBag);
  const updateQuantity = useDualCartStore((s) => s.updateStandardQuantity);
  const removeItem = useDualCartStore((s) => s.removeFromStandardBag);
  const closeDrawer = useDualCartStore((s) => s.closeDrawer);

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;
  const freeShippingThreshold = 15000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "ATELIER10") {
      setDiscountPercent(10);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Use 'ATELIER10' for 10% off.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAF9F6]">
        <div className="w-12 h-12 border border-[#E5E5E0] flex items-center justify-center text-[#666666] mb-4 bg-white">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#111111] mb-1">
          Your Bag is Empty
        </h3>
        <p className="text-xs text-[#666666] max-w-xs mb-6 leading-relaxed">
          Select garments to buy immediately with complimentary express courier delivery.
        </p>
        <button
          onClick={closeDrawer}
          className="px-6 py-3 rounded-none bg-[#111111] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#333333] transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between bg-[#FFFFFF]">
      {/* Free shipping threshold */}
      <div className="p-4 bg-[#FAF9F6] border-b border-[#E5E5E0] text-xs">
        <div className="flex items-center justify-between mb-2 text-[#333333]">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#15803D]" />
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong className="text-[#111111] tabular-nums font-semibold">₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> for free express delivery
              </span>
            ) : (
              <span className="text-[#15803D] font-medium">
                ✓ Free express delivery unlocked
              </span>
            )}
          </span>
          <span className="tabular-nums text-[11px] text-[#666666] font-medium">{shippingPercent}%</span>
        </div>
        <div className="w-full bg-[#E5E5E0] h-1 overflow-hidden">
          <div
            className="bg-[#111111] h-full transition-all duration-300"
            style={{ width: `${shippingPercent}%` }}
          />
        </div>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-[#E5E5E0]">
        {items.map((item) => (
          <div key={item.id} className="pt-4 first:pt-0 flex gap-3 sm:gap-4">
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
            </Link>

            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/shop/${item.productId}`}
                    onClick={closeDrawer}
                    className="text-xs font-semibold uppercase tracking-wider text-[#111111] hover:underline truncate"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#888888] hover:text-[#111111] transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-[#666666] mt-1">
                  Color: {item.selectedColor} • Size: {item.selectedSize}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3">
                {/* Quantity incrementor */}
                <div className="flex items-center border border-[#CCCCCC] bg-[#FFFFFF]">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-[#666666] hover:text-[#111111]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs tabular-nums text-[#111111] font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-[#666666] hover:text-[#111111]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-[#111111] tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                  {item.product.compareAtPrice && (
                    <div className="text-[11px] text-[#888888] line-through tabular-nums">
                      ₹{(item.product.compareAtPrice * item.quantity).toLocaleString("en-IN")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer summary */}
      <div className="p-4 sm:p-5 bg-[#FAF9F6] border-t border-[#E5E5E0] space-y-3">
        {/* Promo code input */}
        <form onSubmit={applyPromo} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-[#888888]" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo code (e.g. ATELIER10)"
              className="w-full pl-9 pr-3 py-2.5 rounded-none bg-white border border-[#CCCCCC] text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-none border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white text-xs uppercase tracking-wider transition-colors font-medium"
          >
            Apply
          </button>
        </form>
        {promoError && (
          <p className="text-[11px] text-[#B45309]">{promoError}</p>
        )}
        {discountPercent > 0 && (
          <p className="text-[11px] text-[#15803D]">
            ✓ 10% discount applied (-₹{discountAmount.toLocaleString("en-IN")})
          </p>
        )}

        <div className="space-y-1.5 text-xs border-t border-[#E5E5E0] pt-3">
          <div className="flex justify-between text-[#666666]">
            <span>Subtotal</span>
            <span className="tabular-nums text-[#111111]">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-[#15803D]">
              <span>Discount</span>
              <span className="tabular-nums">-₹{discountAmount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between text-[#666666]">
            <span>Delivery</span>
            <span className="tabular-nums text-[#15803D]">
              {subtotal >= freeShippingThreshold ? "Free" : "₹450"}
            </span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-[#111111] pt-2 border-t border-[#E5E5E0]">
            <span>Total Payable</span>
            <span className="tabular-nums text-base">
              ₹{(finalTotal + (subtotal >= freeShippingThreshold ? 0 : 450)).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <Link
          href="/checkout?mode=BUY_NOW"
          onClick={closeDrawer}
          className="w-full py-4 rounded-none bg-[#111111] hover:bg-[#333333] text-white font-medium text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-all"
        >
          <span>Continue to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#666666]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
          <span>Payment collected immediately • 30-day returns</span>
        </div>
      </div>
    </div>
  );
}
