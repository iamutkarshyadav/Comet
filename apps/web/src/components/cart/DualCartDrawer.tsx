"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Box } from "lucide-react";
import { useDualCartStore, useHydratedDualCart } from "../../stores/useDualCartStore";
import { StandardBagTab } from "./StandardBagTab";
import { TryHaulBoxTab } from "./TryHaulBoxTab";

export function DualCartDrawer() {
  const isOpen = useDualCartStore((s) => s.isDrawerOpen);
  const activeTab = useDualCartStore((s) => s.activeTab);
  const setActiveTab = useDualCartStore((s) => s.setActiveTab);
  const closeDrawer = useDualCartStore((s) => s.closeDrawer);

  const standardCount = useHydratedDualCart(
    (s) => s.standardBag.reduce((sum, item) => sum + item.quantity, 0),
    0
  );
  const haulCount = useHydratedDualCart(
    (s) => s.tryHaulBox.length,
    0
  );
  const maxHaulCapacity = useDualCartStore((s) => s.maxHaulCapacity);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40"
            onClick={closeDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto sm:pl-10 pointer-events-none">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
              className="w-full sm:w-screen sm:max-w-md bg-[#FFFFFF] border-l border-[#E5E5E0] shadow-2xl flex flex-col pointer-events-auto rounded-none h-full"
            >
              {/* Header with Title and Close Button */}
              <div className="p-4 sm:p-5 border-b border-[#E5E5E0] flex items-center justify-between bg-[#FFFFFF]">
                <h2 className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#111111]">
                  Shopping Bag
                </h2>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 text-[#666666] hover:text-[#111111] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dual Tab Segmented Control */}
              <div className="border-b border-[#E5E5E0] grid grid-cols-2 text-xs bg-[#FAF9F6]">
                {/* Tab 1: Buy Now */}
                <button
                  onClick={() => setActiveTab("BUY_NOW")}
                  className={`py-3 sm:py-3.5 px-2 sm:px-4 text-center font-medium uppercase tracking-wider sm:tracking-[0.15em] transition-all border-b-2 text-[11px] sm:text-xs ${
                    activeTab === "BUY_NOW"
                      ? "border-[#111111] text-[#111111] bg-[#FFFFFF]"
                      : "border-transparent text-[#666666] hover:text-[#111111]"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    <span>Buy Now ({standardCount})</span>
                  </span>
                </button>

                {/* Tab 2: Try at Home */}
                <button
                  onClick={() => setActiveTab("TRY_HAUL")}
                  className={`py-3 sm:py-3.5 px-2 sm:px-4 text-center font-medium uppercase tracking-wider sm:tracking-[0.15em] transition-all border-b-2 text-[11px] sm:text-xs ${
                    activeTab === "TRY_HAUL"
                      ? "border-[#111111] text-[#111111] bg-[#FFFFFF]"
                      : "border-transparent text-[#666666] hover:text-[#111111]"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                    <span className="hidden sm:inline">Try at Home</span>
                    <span className="sm:hidden">Try</span>
                    <span className="tabular-nums">({haulCount}/{maxHaulCapacity})</span>
                  </span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="flex-1 overflow-hidden flex flex-col bg-[#FFFFFF]">
                {activeTab === "BUY_NOW" ? <StandardBagTab /> : <TryHaulBoxTab />}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
