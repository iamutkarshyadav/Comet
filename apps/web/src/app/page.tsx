"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { LUXURY_CATALOG } from "@/data/catalog";
import { LuxuryProduct } from "@/types/try-haul";
import { useDualCartStore } from "@/stores/useDualCartStore";
import { Box, ShoppingBag, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addToStandardBag = useDualCartStore((s) => s.addToStandardBag);
  const addToTryHaulBox = useDualCartStore((s) => s.addToTryHaulBox);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return LUXURY_CATALOG;
    return LUXURY_CATALOG.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const handleAddStandard = (product: LuxuryProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToStandardBag({
      productId: product.id,
      product,
      selectedSize: product.sizes[0] || "M",
      selectedColor: product.colors[0]?.name || "Default",
      quantity: 1,
    });
    showToast(`Added ${product.name} to Purchase Bag`);
  };

  const handleAddHaul = (product: LuxuryProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isTryHaulEligible) {
      showToast("This item is available for standard purchase only.");
      return;
    }
    const res = addToTryHaulBox({
      productId: product.id,
      product,
      selectedSize: product.sizes[0] || "M",
      selectedColor: product.colors[0]?.name || "Default",
    });
    if (!res.success && res.error) {
      showToast(res.error);
    } else {
      showToast(`Added ${product.name} to Try at Home Box (₹0 now)`);
    }
  };

  const scrollToProducts = () => {
    document.getElementById("collection-archive")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-try-at-home-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col font-sans">
      {/* Editorial Luxury Header */}
      <Navbar />

      {/* Floating Status Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#111111] text-white text-xs font-medium uppercase tracking-wider shadow-2xl flex items-center gap-2.5 border border-[#333333]">
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Hero Showcase */}
      <Hero
        onExploreClick={scrollToProducts}
        onHowItWorksClick={scrollToHowItWorks}
      />

      {/* How Try at Home Works — 3-Step Clean Explainer */}
      <section id="how-try-at-home-works" className="py-20 border-b border-[#E5E5E0] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#666666] block mb-2">
              The Doorstep Fitting Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight uppercase">
              How Try at Home Works
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-3 leading-relaxed">
              Experience the garments in your personal environment with your own footwear and mirrors before paying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 bg-[#FAF9F6] border border-[#E5E5E0] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-[#111111] tracking-widest block mb-4">
                  01 / SELECTION
                </span>
                <h3 className="text-base font-semibold text-[#111111] mb-2 uppercase tracking-wide">
                  Pick Up to 5 Items for ₹0 Now
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Select up to 5 garments across sizes and colors into your Try at Home box. You do not pay for any clothes at checkout—only a ₹199 booking deposit.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E5E5E0] text-[11px] text-[#15803D] font-medium">
                ★ 100% credited if you buy anything, or refunded if you return all
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 bg-[#FAF9F6] border border-[#E5E5E0] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-[#111111] tracking-widest block mb-4">
                  02 / DOORSTEP DELIVERY
                </span>
                <h3 className="text-base font-semibold text-[#111111] mb-2 uppercase tracking-wide">
                  Rider Arrives & Waits 20 Minutes
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Our delivery partner brings your garments in sealed garment bags within 60 minutes (or during your chosen 1-hour slot) and waits outside while you try them on in private.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E5E5E0] text-[11px] text-[#111111] font-medium">
                ★ 20-minute private trial window in your home
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 bg-[#FAF9F6] border border-[#E5E5E0] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-[#111111] tracking-widest block mb-4">
                  03 / DECIDE & RESOLVE
                </span>
                <h3 className="text-base font-semibold text-[#111111] mb-2 uppercase tracking-wide">
                  Keep What You Love, Hand Back the Rest
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  On your phone, tap what to keep, return, or swap for a different size. Pay only for kept pieces, and give the 4-digit return code to the rider for returned clothes.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E5E5E0] text-[11px] text-[#111111] font-medium">
                ★ Immediate size exchanges dispatched on the spot
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <main id="collection-archive" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#E5E5E0]">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#666666] block mb-1">
              Atelier Archive
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-[#111111] uppercase tracking-tight">
              Selected Silhouettes
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            {["all", "outerwear", "knitwear", "trousers", "t-shirts"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                  activeCategory === cat
                    ? "bg-[#111111] text-white font-medium"
                    : "text-[#666666] hover:text-[#111111] bg-white border border-[#E5E5E0]"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
            <Link
              href="/shop"
              className="px-4 py-2 text-xs uppercase tracking-[0.15em] border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors ml-2 font-medium"
            >
              View Full Shop
            </Link>
          </div>
        </div>

        {/* Product Cards Grid (3:4 Vertical Studio Portrait) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col bg-white border border-[#E5E5E0] hover:border-[#111111] transition-all"
            >
              {/* Image Frame with Link to PDP */}
              <Link
                href={`/shop/${product.id}`}
                className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F4F0] block"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Secondary Image Hover Swap */}
                {product.images[1] && (
                  <Image
                    src={product.images[1]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}

                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-10">
                  {product.isTryHaulEligible ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-white text-[#15803D] border border-[#15803D]">
                      <Box className="w-3 h-3 text-[#15803D]" />
                      Try at Home
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium bg-white text-[#666666] border border-[#E5E5E0]">
                      Standard Buy
                    </span>
                  )}
                </div>

                {/* Hover Quick-Action Split Bar */}
                <div className="absolute inset-x-2 bottom-2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => handleAddStandard(product, e)}
                    className="flex-1 py-3 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white text-[10px] uppercase tracking-[0.12em] font-semibold border border-[#111111] transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Buy Now</span>
                  </button>

                  {product.isTryHaulEligible && (
                    <button
                      onClick={(e) => handleAddHaul(product, e)}
                      className="flex-1 py-3 bg-[#111111] hover:bg-[#333333] text-white text-[10px] uppercase tracking-[0.12em] font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Box className="w-3 h-3 text-[#15803D]" />
                      <span>Try at Home</span>
                    </button>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#666666] mb-1">
                    <span className="uppercase tracking-[0.15em] text-[10px] font-medium">
                      {product.category}
                    </span>
                    <span className="text-[#15803D] font-medium text-[10px]">
                      {product.isTryHaulEligible ? "Home Trial: ₹0" : "In Stock"}
                    </span>
                  </div>

                  <Link
                    href={`/shop/${product.id}`}
                    className="text-xs font-semibold text-[#111111] uppercase tracking-wider hover:underline line-clamp-1 block"
                  >
                    {product.name}
                  </Link>

                  <p className="text-[11px] text-[#666666] line-clamp-1 mt-1">
                    {product.tagline}
                  </p>
                </div>

                {/* Sizes and Price */}
                <div className="pt-2 border-t border-[#E5E5E0] flex items-center justify-between">
                  <span className="text-xs text-[#888888]">
                    Sizes: {product.sizes.join(", ")}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-[#111111] tabular-nums">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Boutique Footer */}
      <Footer />
    </div>
  );
}
