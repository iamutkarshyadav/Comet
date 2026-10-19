"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Box, Menu, X, ArrowRight } from "lucide-react";
import { useDualCartStore, useHydratedDualCart } from "../../stores/useDualCartStore";
import { useHydratedTryHaulStore } from "../../stores/useTryHaulOrderStore";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openDrawer = useDualCartStore((s) => s.openDrawer);
  const standardCount = useHydratedDualCart(
    (s) => s.standardBag.reduce((sum, item) => sum + item.quantity, 0),
    0
  );
  const haulCount = useHydratedDualCart(
    (s) => s.tryHaulBox.length,
    0
  );
  const maxHaulCapacity = useDualCartStore((s) => s.maxHaulCapacity);

  const activeTrialOrder = useHydratedTryHaulStore(
    (s) => s.currentOrder,
    null
  );

  const navLinks = [
    { label: "Collection", href: "/shop" },
    { label: "How Try at Home Works", href: "/#how-try-at-home-works" },
    { label: "Boutiques", href: "/#boutiques" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6] border-b border-[#E5E5E0] transition-colors">
      {/* Top Notification Bar */}
      {activeTrialOrder && activeTrialOrder.status !== "COMPLETED_HANDOVER" ? (
        <div className="bg-[#111111] text-[#FFFFFF] py-2 px-4 text-center text-xs tracking-wider uppercase flex items-center justify-center gap-3">
          <span className="w-2 h-2 bg-[#15803D]" />
          <span className="font-medium">
            Rider {activeTrialOrder.deliveryPartner.name} is at your door
          </span>
          <span className="text-[#888888]">•</span>
          <Link
            href={`/orders/${activeTrialOrder.id}/try-haul`}
            className="inline-flex items-center gap-1 text-white underline underline-offset-4 hover:text-[#CCCCCC]"
          >
            <span>Open Fitting Screen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-[#FAF9F6] border-b border-[#E5E5E0] py-2 px-4 text-center text-xs tracking-wider uppercase text-[#666666] flex items-center justify-center gap-2">
          <span>Doorstep Fitting: Select up to 5 items to try at home for 20 minutes</span>
          <span className="hidden md:inline text-[#CCCCCC]">|</span>
          <span className="hidden md:inline text-[#111111] font-medium">
            Pay ₹0 now for clothes
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111111] hover:text-[#666666]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Minimalist Fashion Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex flex-col group">
              <span className="text-xl md:text-2xl font-bold tracking-[0.24em] uppercase text-[#111111] group-hover:text-[#444444] transition-colors">
                Aura / Noir
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#666666]">
                New Delhi • Milan • Tokyo
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? "text-[#111111] font-semibold border-b border-[#111111] pb-0.5"
                      : "text-[#666666] hover:text-[#111111]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Dual Action Buttons (Sharp 0px Geometry) */}
          <div className="flex items-center gap-3">
            {/* Standard Bag Trigger */}
            <button
              onClick={() => openDrawer("BUY_NOW")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-none border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-all text-xs font-medium uppercase tracking-wider"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag ({standardCount})</span>
            </button>

            {/* Try at Home Trigger */}
            <button
              onClick={() => openDrawer("TRY_HAUL")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-none bg-[#111111] text-white hover:bg-[#2A2A2A] transition-all text-xs font-medium uppercase tracking-wider"
              aria-label="Open Try at Home Box"
            >
              <Box className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Try at Home ({haulCount}/{maxHaulCapacity})</span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E5E5E0] bg-[#FFFFFF] flex flex-col gap-3 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm uppercase tracking-wider text-[#111111] border-b border-[#F0F0ED]"
              >
                {link.label}
              </Link>
            ))}
            {activeTrialOrder && (
              <Link
                href={`/orders/${activeTrialOrder.id}/try-haul`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-[#F4F4F0] border border-[#E5E5E0] text-xs text-[#111111] flex items-center justify-between"
              >
                <span>Live Fitting Screen (Rider {activeTrialOrder.deliveryPartner.name})</span>
                <ArrowRight className="w-4 h-4 text-[#111111]" />
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
