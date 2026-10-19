"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/Footer";
import { useTryHaulOrderStore, useHydratedTryHaulStore } from "@/stores/useTryHaulOrderStore";
import { ProductSize } from "@/types/try-haul";
import confetti from "canvas-confetti";
import {
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Phone,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TryHaulConsolePage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.id;

  const currentOrder = useHydratedTryHaulStore((s) => s.currentOrder, null);
  const timeRemainingSeconds = useHydratedTryHaulStore((s) => s.timeRemainingSeconds, 1200);
  const initializeDemoOrder = useTryHaulOrderStore((s) => s.initializeDemoOrder);
  const decrementTimer = useTryHaulOrderStore((s) => s.decrementTimer);
  const setItemDecision = useTryHaulOrderStore((s) => s.setItemDecision);
  const bulkSetDecision = useTryHaulOrderStore((s) => s.bulkSetDecision);
  const completeHandover = useTryHaulOrderStore((s) => s.completeHandover);
  const getSettlement = useTryHaulOrderStore((s) => s.getSettlement);

  // Exchange dialog state
  const [exchangeModalItem, setExchangeModalItem] = useState<string | null>(null);
  const [selectedExchangeSize, setSelectedExchangeSize] = useState<ProductSize>("L");

  // Handover OTP Modal state
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [isHandoverFinished, setIsHandoverFinished] = useState<boolean>(false);

  // Initialize demo order if currentOrder is missing or doesn't match id
  useEffect(() => {
    if (!currentOrder || currentOrder.id !== orderId) {
      initializeDemoOrder(orderId);
    }
  }, [orderId, currentOrder, initializeDemoOrder]);

  // 20:00 Live Trial Countdown Timer
  useEffect(() => {
    if (timeRemainingSeconds <= 0) return;
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemainingSeconds, decrementTimer]);

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const settlement = getSettlement();

  const handleOpenExchange = (itemId: string, defaultSize: ProductSize) => {
    setExchangeModalItem(itemId);
    setSelectedExchangeSize(defaultSize === "M" ? "L" : "M");
  };

  const handleConfirmExchange = (itemId: string) => {
    setItemDecision(itemId, "EXCHANGE_REQUESTED", {
      newSize: selectedExchangeSize,
      newColor: "Default",
      dispatchPreference: "IMMEDIATE_DISPATCH",
      priceLocked: true,
    });
    setExchangeModalItem(null);
  };

  const handleFinishHandover = () => {
    completeHandover();
    setIsHandoverFinished(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <span className="text-xs uppercase tracking-widest text-[#666666]">
          Loading Fitting Console...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col font-sans">
      <Navbar />

      {/* Live Fitting Status Bar (Rider Rahul is at door • 20:00 remaining) */}
      <div className="sticky top-20 sm:top-24 z-30 bg-[#111111] text-white border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Rider status */}
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-[#15803D] animate-pulse shrink-0" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider block">
                Rider {currentOrder.deliveryPartner.name} is at your door
              </span>
              <span className="text-[11px] text-[#AAAAAA] hidden sm:inline">
                Vehicle: {currentOrder.deliveryPartner.vehicleNumber} • Rating {currentOrder.deliveryPartner.rating}★
              </span>
            </div>
          </div>

          {/* Right: Live countdown timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 border border-white/20">
              <Clock className="w-4 h-4 text-[#15803D] shrink-0" />
              <span className="text-xs uppercase tracking-wider text-[#CCCCCC] hidden sm:inline">
                Trial Window:
              </span>
              <span className="text-sm font-mono font-bold tracking-widest text-white tabular-nums">
                {formattedTime}
              </span>
            </div>

            <a
              href={`tel:${currentOrder.deliveryPartner.phone}`}
              className="px-3 py-1.5 bg-white text-[#111111] hover:bg-[#FAF9F6] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call Rider</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Console Header */}
      <div className="border-b border-[#E5E5E0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-[#666666] block mb-1">
                Order #{currentOrder.orderNumber}
              </span>
              <h1 className="text-xl sm:text-3xl font-normal text-[#111111] uppercase tracking-tight">
                Doorstep Trial Console
              </h1>
              <p className="text-xs text-[#666666] mt-1 max-w-xl leading-relaxed">
                Try on each garment in your private space. Mark each piece below to keep, return to Rahul, or request a size exchange.
              </p>
            </div>

            {/* Bulk Action Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => bulkSetDecision("KEEP")}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#111111] hover:bg-[#333333] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Keep All</span>
              </button>
              <button
                type="button"
                onClick={() => bulkSetDecision("RETURN")}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-[#FAF9F6] text-[#111111] text-xs uppercase tracking-wider font-semibold border border-[#111111] transition-colors flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Return All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Handover Completed Banner */}
      {isHandoverFinished && (
        <div className="bg-[#15803D] text-white py-4 px-4 text-center text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Doorstep Handover Successfully Completed • Receipt Sent to {currentOrder.customer.phone}</span>
        </div>
      )}

      {/* Main Trial Manifest */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-28 lg:pb-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Garments List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#666666] block mb-2">
              Garments in Your Fitting Box ({currentOrder.items.length})
            </span>

            {currentOrder.items.map((item) => {
              const isKept = item.decision === "KEEP";
              const isReturned = item.decision === "RETURN";
              const isExchanged = item.decision === "EXCHANGE_REQUESTED";

              return (
                <div
                  key={item.id}
                  className={`p-3.5 sm:p-5 bg-white border transition-all ${
                    isKept
                      ? "border-[#111111] ring-1 ring-[#111111]"
                      : isReturned
                      ? "border-[#E5E5E0] opacity-75"
                      : isExchanged
                      ? "border-[#15803D] ring-1 ring-[#15803D]"
                      : "border-[#E5E5E0]"
                  }`}
                >
                  <div className="flex flex-row gap-3.5 sm:gap-5">
                    {/* 3:4 Portrait Garment Shot */}
                    <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-[#F4F4F0] shrink-0 border border-[#E5E5E0] self-start">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Details & Decision Selector */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block truncate">
                              {item.product.category}
                            </span>
                            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#111111] truncate">
                              {item.product.name}
                            </h3>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#666666] mt-1">
                              <span>Size: <strong>{item.size}</strong></span>
                              <span>•</span>
                              <span className="truncate">Color: {item.color}</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm sm:text-base font-semibold text-[#111111] tabular-nums block">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                            <span className="block text-[10px] text-[#666666]">
                              {isKept
                                ? "Purchased"
                                : isReturned
                                ? "Returning (₹0)"
                                : isExchanged
                                ? "Swap Requested"
                                : "Pending Choice"}
                            </span>
                          </div>
                        </div>

                        {item.isBackupSize && (
                          <span className="inline-block mt-2 text-[9px] sm:text-[10px] uppercase tracking-wider bg-[#FAF9F6] text-[#666666] px-2 py-0.5 border border-[#E5E5E0] font-medium">
                            Paired Complimentary Backup Size
                          </span>
                        )}

                        {isExchanged && item.exchangeDetails && (
                          <div className="mt-2 text-xs text-[#15803D] bg-[#15803D]/10 p-2 border border-[#15803D]/30 flex items-center justify-between gap-2">
                            <span className="text-[11px] truncate">
                              Exchanging for <strong>{item.exchangeDetails.newSize}</strong>
                            </span>
                            <button
                              onClick={() => handleOpenExchange(item.id, item.size)}
                              className="text-[11px] underline font-semibold text-[#15803D] shrink-0"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 3-Button Choice Matrix */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-[#E5E5E0]">
                        {/* 1. Keep & Buy */}
                        <button
                          type="button"
                          onClick={() => setItemDecision(item.id, "KEEP")}
                          className={`py-2 px-1.5 sm:px-2 text-[11px] sm:text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1 ${
                            isKept
                              ? "bg-[#111111] text-white"
                              : "bg-white text-[#111111] border border-[#E5E5E0] hover:border-[#111111]"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Keep<span className="hidden sm:inline"> &amp; Buy</span></span>
                        </button>

                        {/* 2. Return to Rider */}
                        <button
                          type="button"
                          onClick={() => setItemDecision(item.id, "RETURN")}
                          className={`py-2 px-1.5 sm:px-2 text-[11px] sm:text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1 ${
                            isReturned
                              ? "bg-[#666666] text-white"
                              : "bg-white text-[#666666] border border-[#E5E5E0] hover:border-[#666666]"
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Return<span className="hidden sm:inline"> to Rider</span></span>
                        </button>

                        {/* 3. Need Different Size/Color */}
                        <button
                          type="button"
                          onClick={() => handleOpenExchange(item.id, item.size)}
                          className={`py-2 px-1.5 sm:px-2 text-[11px] sm:text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1 ${
                            isExchanged
                              ? "bg-[#15803D] text-white"
                              : "bg-white text-[#15803D] border border-[#15803D] hover:bg-[#15803D]/10"
                          }`}
                        >
                          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                          <span>Swap<span className="hidden sm:inline"> Size</span></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Settlement Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#E5E5E0] p-5 sm:p-6 sticky top-36">
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#666666] block mb-1">
                Live Doorstep Math
              </span>
              <h2 className="text-base sm:text-lg font-normal uppercase tracking-tight text-[#111111] pb-3 border-b border-[#E5E5E0]">
                Settlement Summary
              </h2>

              <div className="py-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#666666]">
                  <span>Kept Clothes:</span>
                  <span className="font-semibold text-[#111111] tabular-nums">
                    ₹{settlement.keptTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {settlement.lockedExchangeTotal > 0 && (
                  <div className="flex justify-between text-[#666666]">
                    <span>Immediate Size Swaps:</span>
                    <span className="font-semibold text-[#111111] tabular-nums">
                      ₹{settlement.lockedExchangeTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#15803D]">
                  <span>Trial Deposit Adjustment:</span>
                  <span className="font-semibold tabular-nums">
                    -₹{settlement.depositApplied.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E5E5E0] flex justify-between items-baseline">
                  <span className="font-semibold uppercase tracking-wider text-[#111111] text-xs">
                    Net Due to Rider:
                  </span>
                  <span className="text-xl sm:text-2xl font-normal text-[#111111] tabular-nums">
                    ₹{settlement.netPayableToRider.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Refund Status Note */}
                {settlement.keptTotal === 0 && (
                  <div className="mt-3 p-3 bg-[#FAF9F6] border border-[#E5E5E0] text-[11px] text-[#666666] leading-relaxed">
                    <strong className="text-[#15803D] block mb-0.5">Returning All Clothes?</strong>
                    Your ₹199 trial deposit will be 100% refunded to your original payment method within 2 hours of handover.
                  </div>
                )}
              </div>

              {/* Handover & Return Code Action */}
              <div className="pt-4 border-t border-[#E5E5E0] space-y-3">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(true)}
                  className="w-full py-3.5 sm:py-4 bg-[#111111] hover:bg-[#262626] text-white text-xs uppercase tracking-[0.18em] font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                  <span>Show Rider Return Code</span>
                </button>

                <p className="text-[10px] text-center text-[#888888] leading-tight">
                  Hand over returned pieces to Rahul and share your 4-digit code to conclude the trial session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Settlement & Return Code Bar (Visible only on mobile/tablet) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#111111] p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#666666] block">
              Net Due to Rider
            </span>
            <span className="text-lg font-semibold text-[#111111] tabular-nums leading-none">
              ₹{settlement.netPayableToRider.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowOtpModal(true)}
            className="px-4 py-2.5 bg-[#111111] active:bg-[#333333] text-white text-[11px] uppercase tracking-[0.14em] font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Show Return Code</span>
          </button>
        </div>
      </div>

      {/* Exchange Size Modal */}
      {exchangeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E5E0] max-w-md w-full p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setExchangeModalItem(null)}
              className="absolute top-4 right-4 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#666666] block mb-1">
              Immediate Swap
            </span>
            <h3 className="text-lg font-normal uppercase tracking-tight text-[#111111] mb-2">
              Select Replacement Size
            </h3>
            <p className="text-xs text-[#666666] mb-4 leading-relaxed">
              Our central hub will dispatch your requested replacement size immediately with no extra delivery fee.
            </p>

            <div className="grid grid-cols-6 gap-2 mb-6">
              {(["XS", "S", "M", "L", "XL", "XXL"] as ProductSize[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedExchangeSize(sz)}
                  className={`h-11 text-xs uppercase font-medium border transition-all ${
                    selectedExchangeSize === sz
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-[#E5E5E0] bg-white text-[#111111] hover:border-[#111111]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleConfirmExchange(exchangeModalItem)}
                className="flex-1 py-3 bg-[#111111] text-white text-xs uppercase tracking-wider font-semibold"
              >
                Confirm Size Swap
              </button>
              <button
                type="button"
                onClick={() => setExchangeModalItem(null)}
                className="py-3 px-4 border border-[#E5E5E0] text-xs uppercase tracking-wider text-[#666666]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Digit Handover OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E5E0] max-w-md w-full p-5 sm:p-8 text-center relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#666666] block mb-2">
              Doorstep Handover Verification
            </span>
            <h3 className="text-xl font-normal uppercase tracking-tight text-[#111111] mb-2">
              Give This Code To Rahul
            </h3>
            <p className="text-xs text-[#666666] mb-6 leading-relaxed">
              Rahul will scan your returned garments and verify this 4-digit code on his terminal to release your deposit and conclude the fitting.
            </p>

            {/* OTP Display */}
            <div className="py-6 px-4 bg-[#FAF9F6] border-2 border-[#111111] inline-block w-full mb-6">
              <span className="text-4xl font-mono font-bold tracking-[0.3em] text-[#111111]">
                {currentOrder.handoverOtp}
              </span>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowOtpModal(false);
                  handleFinishHandover();
                }}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#262626] text-white text-xs uppercase tracking-wider font-semibold"
              >
                Confirm Handover Completed
              </button>

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="text-xs text-[#666666] uppercase tracking-wider hover:underline"
              >
                Close & Return to Trial
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
