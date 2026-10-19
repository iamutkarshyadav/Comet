"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/Footer";
import { LUXURY_CATALOG } from "@/data/catalog";
import { LuxuryProduct, ProductSize } from "@/types/try-haul";
import { useDualCartStore } from "@/stores/useDualCartStore";
import {
  Box,
  ShoppingBag,
  CheckCircle2,
  LayoutGrid,
  Grid2X2,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<ProductSize | "all">("all");
  const [tryHaulOnly, setTryHaulOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [columns, setColumns] = useState<1 | 2 | 4>(4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addToStandardBag = useDualCartStore((s) => s.addToStandardBag);
  const addToTryHaulBox = useDualCartStore((s) => s.addToTryHaulBox);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
    showToast(`Added ${product.name} to Bag`);
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
      showToast(`Added ${product.name} to Try at Home Box`);
    }
  };

  const filteredProducts = useMemo(() => {
    return LUXURY_CATALOG.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (selectedSize !== "all" && !item.sizes.includes(selectedSize)) {
        return false;
      }
      if (tryHaulOnly && !item.isTryHaulEligible) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, selectedSize, tryHaulOnly, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("all");
    setTryHaulOnly(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "all" || selectedSize !== "all" || tryHaulOnly;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col font-sans">
      <Navbar />

      {/* Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#111111] text-white text-xs font-medium uppercase tracking-wider shadow-2xl flex items-center gap-2.5 border border-[#333333]">
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Collection Header */}
      <div className="border-b border-[#E5E5E0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-[#666666] block mb-1 sm:mb-2">
            Collection Archive
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-normal text-[#111111] uppercase tracking-tight">
                All Garments
              </h1>
              <p className="text-xs sm:text-sm text-[#666666] mt-1 sm:mt-1.5 max-w-xl leading-relaxed">
                Architectural tailoring, premium organic wools, and heavyweight knits. Eligible pieces can be tried at your home for 20 minutes before payment.
              </p>
            </div>
            <span className="text-xs text-[#888888] uppercase tracking-widest font-mono">
              {filteredProducts.length} Silhouettes Available
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="sticky top-20 sm:top-24 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Pills (Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full md:w-auto">
            {["all", "outerwear", "knitwear", "trousers", "t-shirts"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[#111111] text-white font-medium"
                    : "bg-white text-[#666666] border border-[#E5E5E0] hover:text-[#111111]"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          {/* Right Controls: Filter Options & View Switch */}
          <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Try at Home Toggle */}
            <button
              onClick={() => setTryHaulOnly(!tryHaulOnly)}
              className={`px-2.5 sm:px-3 py-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors border shrink-0 ${
                tryHaulOnly
                  ? "bg-[#15803D] text-white border-[#15803D] font-medium"
                  : "bg-white text-[#111111] border-[#E5E5E0] hover:border-[#111111]"
              }`}
            >
              <Box className="w-3.5 h-3.5 text-current shrink-0" />
              <span className="hidden xs:inline">Try at Home</span>
              <span className="xs:hidden">Try ₹0</span>
            </button>

            {/* Size Filter Dropdown */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as ProductSize | "all")}
              className="px-2 sm:px-3 py-1.5 text-xs uppercase tracking-wider bg-white border border-[#E5E5E0] text-[#111111] focus:outline-none cursor-pointer shrink-0"
            >
              <option value="all">Sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")
              }
              className="px-2 sm:px-3 py-1.5 text-xs uppercase tracking-wider bg-white border border-[#E5E5E0] text-[#111111] focus:outline-none cursor-pointer shrink-0"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>

            {/* Mobile View Toggle: 1-Col vs 2-Col */}
            <div className="flex md:hidden items-center border border-[#E5E5E0] bg-white shrink-0">
              <button
                onClick={() => setColumns(columns === 1 ? 2 : 1)}
                className="px-2 py-1.5 text-[11px] uppercase font-semibold text-[#111111] flex items-center gap-1"
                title="Toggle 1 or 2 Columns"
              >
                {columns === 1 ? <Grid2X2 className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
                <span>{columns === 1 ? "2-Col" : "1-Col"}</span>
              </button>
            </div>

            {/* Desktop Grid View Layout Toggle (2-Col vs 4-Col) */}
            <div className="hidden md:flex items-center border border-[#E5E5E0] bg-white shrink-0">
              <button
                onClick={() => setColumns(2)}
                className={`p-1.5 transition-colors ${
                  columns === 2
                    ? "bg-[#111111] text-white"
                    : "text-[#666666] hover:text-[#111111]"
                }`}
                title="2-Column Editorial View"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setColumns(4)}
                className={`p-1.5 transition-colors ${
                  columns === 4
                    ? "bg-[#111111] text-white"
                    : "text-[#666666] hover:text-[#111111]"
                }`}
                title="4-Column Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs uppercase tracking-wider text-[#666666] hover:text-[#111111] flex items-center gap-1 font-medium pl-1 shrink-0"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white border border-[#E5E5E0] p-8">
            <SlidersHorizontal className="w-8 h-8 text-[#888888] mx-auto mb-3" />
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#111111]">
              No Matching Garments
            </h3>
            <p className="text-xs text-[#666666] mt-1 mb-6 max-w-sm mx-auto">
              No products found for the selected filter combination. Try clearing your filters to view all silhouettes.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-[#111111] text-white text-xs uppercase tracking-wider font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${
              columns === 1
                ? "grid-cols-1"
                : columns === 2
                ? "grid-cols-2"
                : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white border border-[#E5E5E0] hover:border-[#111111] transition-all"
              >
                {/* Image Frame with Clean Link */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F4F0] block">
                  <Link
                    href={`/shop/${product.id}`}
                    className="absolute inset-0 z-10"
                    aria-label={product.name}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes={
                        columns === 1
                          ? "100vw"
                          : columns === 2
                          ? "(max-width: 768px) 50vw, 50vw"
                          : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      }
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Secondary Image Hover Swap */}
                    {product.images[1] && (
                      <Image
                        src={product.images[1]}
                        alt=""
                        fill
                        sizes={
                          columns === 1
                            ? "100vw"
                            : columns === 2
                            ? "(max-width: 768px) 50vw, 50vw"
                            : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        }
                        className="object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </Link>

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 pointer-events-none">
                    {product.isTryHaulEligible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold bg-white/95 text-[#15803D] border border-[#15803D] backdrop-blur-xs">
                        <Box className="w-3 h-3 text-[#15803D]" />
                        Try at Home
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium bg-white/95 text-[#666666] border border-[#E5E5E0] backdrop-blur-xs">
                        Standard Buy
                      </span>
                    )}
                  </div>

                  {/* Quick-Action Split Bar (Touch-friendly on mobile, hover on desktop) */}
                  <div className="absolute inset-x-1.5 sm:inset-x-2 bottom-1.5 sm:bottom-2 z-20 flex gap-1 sm:gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleAddStandard(product, e)}
                      className="flex-1 py-2 sm:py-3 bg-[#FFFFFF]/95 hover:bg-[#111111] text-[#111111] hover:text-white text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.12em] font-semibold border border-[#111111] transition-colors flex items-center justify-center gap-1 shadow-sm backdrop-blur-xs"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Buy</span>
                    </button>

                    {product.isTryHaulEligible && (
                      <button
                        onClick={(e) => handleAddHaul(product, e)}
                        className="flex-1 py-2 sm:py-3 bg-[#111111]/95 hover:bg-[#333333] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.12em] font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm backdrop-blur-xs"
                      >
                        <Box className="w-3 h-3 text-[#15803D]" />
                        <span>Try ₹0</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3 bg-white">
                  <div>
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#666666] mb-1">
                      <span className="uppercase tracking-[0.15em] font-medium">
                        {product.category}
                      </span>
                      <span className="text-[#15803D] font-medium hidden sm:inline">
                        {product.isTryHaulEligible ? "Home Trial: ₹0" : "In Stock"}
                      </span>
                    </div>

                    <Link
                      href={`/shop/${product.id}`}
                      className="text-xs font-semibold text-[#111111] uppercase tracking-wider hover:underline line-clamp-1 block"
                    >
                      {product.name}
                    </Link>

                    <p className="text-[11px] text-[#666666] line-clamp-1 mt-1 hidden sm:block">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Sizes and Price */}
                  <div className="pt-2 border-t border-[#E5E5E0] flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs text-[#888888] truncate max-w-[100px]">
                      {product.sizes.join(", ")}
                    </span>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-semibold text-[#111111] tabular-nums">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
