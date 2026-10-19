"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/Footer";
import { useHydratedDualCart, useDualCartStore } from "@/stores/useDualCartStore";
import { useTryHaulOrderStore } from "@/stores/useTryHaulOrderStore";
import { TryHaulOrder, TryHaulOrderItem } from "@/types/try-haul";
import {
  Box,
  ShoppingBag,
  CheckCircle2,
  Calendar,
  Zap,
  Lock,
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "BUY_NOW" ? "BUY_NOW" : "TRY_HAUL";

  const standardBag = useHydratedDualCart((s) => s.standardBag, []);
  const tryHaulBox = useHydratedDualCart((s) => s.tryHaulBox, []);
  const clearCart = useDualCartStore((s) => s.clearCart);
  const setOrder = useTryHaulOrderStore((s) => s.setOrder);

  // Mode state: default to whichever cart has items if one is empty
  const [checkoutMode, setCheckoutMode] = useState<"TRY_HAUL" | "BUY_NOW">(() => {
    if (initialMode === "BUY_NOW" && standardBag.length > 0) return "BUY_NOW";
    if (tryHaulBox.length > 0) return "TRY_HAUL";
    if (standardBag.length > 0) return "BUY_NOW";
    return "TRY_HAUL";
  });

  // Delivery & Schedule state
  const [dispatchType, setDispatchType] = useState<"EXPRESS" | "SCHEDULED">("EXPRESS");
  const [scheduledSlot, setScheduledSlot] = useState<string>("Today, 4:00 PM – 5:00 PM");

  // Customer Form state
  const [fullName, setFullName] = useState<string>("Rohit Malhotra");
  const [phone, setPhone] = useState<string>("+91 98112 45890");
  const [address, setAddress] = useState<string>("Villa 4, Golf Links, Central District");
  const [city, setCity] = useState<string>("New Delhi");
  const [pincode, setPincode] = useState<string>("110003");
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");

  // Buy Now order placed state
  const [buyNowSuccess, setBuyNowSuccess] = useState<boolean>(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>("");

  // Subtotal for standard bag
  const standardSubtotal = standardBag.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const availableSlots = [
    "Today, 3:00 PM – 4:00 PM",
    "Today, 5:00 PM – 6:00 PM",
    "Today, 7:00 PM – 8:00 PM",
    "Tomorrow, 11:00 AM – 12:00 PM",
    "Tomorrow, 2:00 PM – 3:00 PM",
  ];

  // Try Haul Booking Handler
  const handleBookTryHaul = (e: React.FormEvent) => {
    e.preventDefault();
    if (tryHaulBox.length === 0) return;

    const orderId = `ORD-TH-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems: TryHaulOrderItem[] = tryHaulBox.map((item, idx) => ({
      id: `order-item-${idx}-${Date.now()}`,
      productId: item.productId,
      product: item.product,
      size: item.selectedSize,
      color: item.selectedColor,
      price: item.product.price,
      isBackupSize: item.isBackupSize,
      parentItemId: item.parentItemId,
      decision: "PENDING_TRIAL",
    }));

    const newOrder: TryHaulOrder = {
      id: orderId,
      orderNumber: `TH-2026-${orderId.split("-")[2]}`,
      customer: {
        name: fullName,
        phone,
        address,
        city,
        pincode,
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
      trialConvenienceDeposit: 199,
      handoverOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      items: orderItems,
    };

    setOrder(newOrder);
    clearCart("TRY_HAUL");
    router.push(`/orders/${orderId}/try-haul`);
  };

  // Buy Now Order Handler
  const handlePlaceBuyNowOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (standardBag.length === 0) return;

    const orderNum = `ORD-PUR-${Math.floor(10000 + Math.random() * 90000)}`;
    setPlacedOrderNumber(orderNum);
    setBuyNowSuccess(true);
    clearCart("BUY_NOW");
  };

  // Success screen for standard Buy Now
  if (buyNowSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col font-sans">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#15803D]/10 border border-[#15803D] flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#15803D]" />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#666666] block mb-2">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-normal text-[#111111] uppercase tracking-tight mb-3">
            Thank You For Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto leading-relaxed mb-6">
            Your garments are being prepared at our fulfillment studio. A confirmation has been sent to your phone along with express tracking.
          </p>
          <div className="p-4 bg-white border border-[#E5E5E0] w-full max-w-md text-left mb-8">
            <div className="flex justify-between text-xs py-1 border-b border-[#E5E5E0]">
              <span className="text-[#666666]">Order Reference:</span>
              <span className="font-mono font-semibold">{placedOrderNumber}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-[#E5E5E0]">
              <span className="text-[#666666]">Delivery Address:</span>
              <span className="font-medium text-right max-w-[200px] truncate">{address}</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-[#666666]">Estimated Delivery:</span>
              <span className="font-medium text-[#15803D]">Within 48 Hours</span>
            </div>
          </div>
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-[#111111] text-white text-xs uppercase tracking-wider font-semibold"
          >
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col font-sans">
      <Navbar />

      {/* Checkout Mode Header */}
      <div className="border-b border-[#E5E5E0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#666666] block mb-1">
                Secure Checkout
              </span>
              <h1 className="text-2xl sm:text-3xl font-normal text-[#111111] uppercase tracking-tight">
                {checkoutMode === "TRY_HAUL" ? "Book Doorstep Home Trial" : "Standard Purchase Checkout"}
              </h1>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center border border-[#E5E5E0] bg-[#FAF9F6] p-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCheckoutMode("TRY_HAUL")}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  checkoutMode === "TRY_HAUL"
                    ? "bg-[#111111] text-white shadow-xs"
                    : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                <Box className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                <span className="hidden xs:inline">Try at Home</span>
                <span className="xs:hidden">Try</span>
                <span className="tabular-nums">({tryHaulBox.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutMode("BUY_NOW")}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  checkoutMode === "BUY_NOW"
                    ? "bg-[#111111] text-white shadow-xs"
                    : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">Buy Now</span>
                <span className="xs:hidden">Buy</span>
                <span className="tabular-nums">({standardBag.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full flex-1">
        {/* Empty State Warning */}
        {checkoutMode === "TRY_HAUL" && tryHaulBox.length === 0 ? (
          <div className="bg-white border border-[#E5E5E0] p-8 sm:p-12 text-center max-w-xl mx-auto my-8 sm:my-12">
            <Box className="w-10 h-10 text-[#666666] mx-auto mb-4" />
            <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider text-[#111111] mb-2">
              Your Try at Home Box is Empty
            </h2>
            <p className="text-xs text-[#666666] mb-6 leading-relaxed">
              Add up to 5 items to your box from the catalog to book a 20-minute private doorstep fitting session.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-[#111111] text-white text-xs uppercase tracking-wider font-semibold"
            >
              Browse The Collection
            </Link>
          </div>
        ) : checkoutMode === "BUY_NOW" && standardBag.length === 0 ? (
          <div className="bg-white border border-[#E5E5E0] p-8 sm:p-12 text-center max-w-xl mx-auto my-8 sm:my-12">
            <ShoppingBag className="w-10 h-10 text-[#666666] mx-auto mb-4" />
            <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider text-[#111111] mb-2">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs text-[#666666] mb-6 leading-relaxed">
              Add pieces to your bag to proceed with standard express online purchase.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-[#111111] text-white text-xs uppercase tracking-wider font-semibold"
            >
              Browse The Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Column (Inputs & Options, 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
              {/* If Try at Home: Delivery Window Selector */}
              {checkoutMode === "TRY_HAUL" && (
                <div className="bg-white border border-[#E5E5E0] p-4 sm:p-8">
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#666666] block mb-1">
                    Step 01 / Fitting Dispatch
                  </span>
                  <h2 className="text-base sm:text-lg font-normal uppercase tracking-tight text-[#111111] mb-4">
                    Select Doorstep Arrival Window
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Option A: Express Within 60 Mins */}
                    <button
                      type="button"
                      onClick={() => setDispatchType("EXPRESS")}
                      className={`p-4 border text-left flex flex-col justify-between transition-all ${
                        dispatchType === "EXPRESS"
                          ? "border-[#111111] bg-[#FAF9F6] ring-1 ring-[#111111]"
                          : "border-[#E5E5E0] hover:border-[#888888] bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111]">
                          <Zap className="w-4 h-4 text-[#15803D]" />
                          Express 60 Mins
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#15803D] text-white uppercase">
                          Fastest
                        </span>
                      </div>
                      <p className="text-xs text-[#666666] leading-relaxed">
                        Dedicated rider departs immediately from our local metro hub. Arrives at your door within 60 minutes.
                      </p>
                    </button>

                    {/* Option B: Scheduled 1-Hour Slot */}
                    <button
                      type="button"
                      onClick={() => setDispatchType("SCHEDULED")}
                      className={`p-4 border text-left flex flex-col justify-between transition-all ${
                        dispatchType === "SCHEDULED"
                          ? "border-[#111111] bg-[#FAF9F6] ring-1 ring-[#111111]"
                          : "border-[#E5E5E0] hover:border-[#888888] bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111]">
                          <Calendar className="w-4 h-4 text-[#111111]" />
                          Scheduled Slot
                        </span>
                        <span className="text-[10px] text-[#666666] uppercase">
                          Choice of Time
                        </span>
                      </div>
                      <p className="text-xs text-[#666666] leading-relaxed">
                        Choose an exact 1-hour window for when you will be home to try the garments.
                      </p>
                    </button>
                  </div>

                  {/* Scheduled Slots Dropdown / Grid */}
                  {dispatchType === "SCHEDULED" && (
                    <div className="pt-4 border-t border-[#E5E5E0]">
                      <label className="block text-xs uppercase tracking-wider text-[#666666] font-semibold mb-2">
                        Choose 1-Hour Fitting Window:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setScheduledSlot(slot)}
                            className={`py-2.5 px-3 text-xs text-left border transition-all ${
                              scheduledSlot === slot
                                ? "border-[#111111] bg-[#111111] text-white font-medium"
                                : "border-[#E5E5E0] bg-white text-[#111111] hover:border-[#111111]"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Address Form */}
              <div className="bg-white border border-[#E5E5E0] p-4 sm:p-8">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#666666] block mb-1">
                  Step 02 / Location Details
                </span>
                <h2 className="text-base sm:text-lg font-normal uppercase tracking-tight text-[#111111] mb-4">
                  Doorstep Delivery Address
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#666666] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E5E0] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#666666] mb-1.5">
                        Phone (for rider call)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E5E0] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#666666] mb-1.5">
                      Street Address & Residence Number
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E5E0] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#666666] mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E5E0] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#666666] mb-1.5">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E5E5E0] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white border border-[#E5E5E0] p-4 sm:p-8">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#666666] block mb-1">
                  Step 03 / Payment Authorization
                </span>
                <h2 className="text-base sm:text-lg font-normal uppercase tracking-tight text-[#111111] mb-2">
                  {checkoutMode === "TRY_HAUL" ? "Refundable Deposit Payment" : "Payment Method"}
                </h2>
                <p className="text-xs text-[#666666] mb-4">
                  {checkoutMode === "TRY_HAUL"
                    ? "Pay ₹199 deposit now. It is 100% credited toward any item you keep, or instantly refunded if you return all clothes to the rider."
                    : "Encrypted 256-bit secure transaction."}
                </p>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: "upi", label: "UPI / QR" },
                    { id: "card", label: "Card" },
                    { id: "netbanking", label: "NetBanking" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`py-3 px-2 sm:px-3 border text-xs uppercase tracking-wider font-semibold transition-all ${
                        paymentMethod === method.id
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#E5E5E0] bg-white text-[#111111] hover:border-[#111111]"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Order Summary & Submit CTA, 5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-[#E5E5E0] p-4 sm:p-8 sticky top-24">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#666666] block mb-1">
                  Review & Authorize
                </span>
                <h2 className="text-base sm:text-lg font-normal uppercase tracking-tight text-[#111111] pb-3 sm:pb-4 border-b border-[#E5E5E0]">
                  {checkoutMode === "TRY_HAUL" ? "Try at Home Manifest" : "Order Summary"}
                </h2>

                {/* Items List */}
                <div className="py-4 space-y-3 max-h-[320px] overflow-y-auto divide-y divide-[#E5E5E0]">
                  {checkoutMode === "TRY_HAUL"
                    ? tryHaulBox.map((item) => (
                        <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                          <div className="relative w-14 h-18 bg-[#F4F4F0] shrink-0 border border-[#E5E5E0]">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-[#111111] uppercase tracking-wider block truncate">
                              {item.product.name}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-[#666666] mt-0.5">
                              <span>Size: {item.selectedSize}</span>
                              <span>•</span>
                              <span>{item.selectedColor}</span>
                            </div>
                            {item.isBackupSize && (
                              <span className="inline-block mt-1 text-[9px] uppercase tracking-wider bg-[#F4F4F0] px-1.5 py-0.5 font-semibold text-[#666666] border border-[#E5E5E0]">
                                Free Backup Size
                              </span>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-medium text-[#15803D]">
                              ₹0 now
                            </span>
                            <span className="block text-[10px] text-[#888888] tabular-nums">
                              ₹{item.product.price.toLocaleString("en-IN")} if kept
                            </span>
                          </div>
                        </div>
                      ))
                    : standardBag.map((item) => (
                        <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                          <div className="relative w-14 h-18 bg-[#F4F4F0] shrink-0 border border-[#E5E5E0]">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-[#111111] uppercase tracking-wider block truncate">
                              {item.product.name}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-[#666666] mt-0.5">
                              <span>Qty: {item.quantity}</span>
                              <span>•</span>
                              <span>Size: {item.selectedSize}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-semibold text-[#111111] tabular-nums">
                              ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-[#E5E5E0] space-y-2 text-xs">
                  {checkoutMode === "TRY_HAUL" ? (
                    <>
                      <div className="flex justify-between text-[#666666]">
                        <span>Pay Now for Clothes:</span>
                        <span className="font-semibold text-[#15803D]">₹0</span>
                      </div>
                      <div className="flex justify-between text-[#666666]">
                        <span>Doorstep Trial Booking Deposit:</span>
                        <span className="font-semibold text-[#111111]">₹199</span>
                      </div>
                      <div className="flex justify-between text-[#666666]">
                        <span>Express Delivery & Doorstep Wait:</span>
                        <span className="text-[#15803D] font-medium">Included</span>
                      </div>
                      <div className="pt-3 border-t border-[#E5E5E0] flex justify-between items-baseline text-sm">
                        <span className="font-semibold uppercase tracking-wider text-[#111111]">
                          Pay Now to Book Trial:
                        </span>
                        <span className="text-xl font-normal text-[#111111] tabular-nums">
                          ₹199
                        </span>
                      </div>
                      <p className="text-[11px] text-[#15803D] leading-tight pt-1">
                        ★ 100% adjusted toward kept items, or refunded to your account if all items are returned.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-[#666666]">
                        <span>Subtotal:</span>
                        <span className="font-semibold text-[#111111] tabular-nums">
                          ₹{standardSubtotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#666666]">
                        <span>Express Shipping:</span>
                        <span className="text-[#15803D] font-medium">Complimentary</span>
                      </div>
                      <div className="flex justify-between text-[#666666]">
                        <span>Taxes:</span>
                        <span className="text-[#666666]">Included</span>
                      </div>
                      <div className="pt-3 border-t border-[#E5E5E0] flex justify-between items-baseline text-sm">
                        <span className="font-semibold uppercase tracking-wider text-[#111111]">
                          Total Payable:
                        </span>
                        <span className="text-xl font-normal text-[#111111] tabular-nums">
                          ₹{standardSubtotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-6">
                  {checkoutMode === "TRY_HAUL" ? (
                    <button
                      type="button"
                      onClick={handleBookTryHaul}
                      className="w-full py-4 px-3 bg-[#111111] hover:bg-[#262626] active:bg-[#333333] text-white text-xs uppercase tracking-[0.12em] sm:tracking-[0.18em] font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-[#15803D] shrink-0" />
                      <span>Pay ₹199 &amp; Book Doorstep Trial</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePlaceBuyNowOrder}
                      className="w-full py-4 px-3 bg-[#111111] hover:bg-[#262626] active:bg-[#333333] text-white text-xs uppercase tracking-[0.12em] sm:tracking-[0.18em] font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>Pay ₹{standardSubtotal.toLocaleString("en-IN")} &amp; Place Order</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-[#666666]">
            Loading Checkout...
          </span>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
