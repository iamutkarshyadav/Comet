"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/Footer";
import { LUXURY_CATALOG } from "@/data/catalog";
import { ProductSize } from "@/types/try-haul";
import { useDualCartStore } from "@/stores/useDualCartStore";
import {
  Box,
  ShoppingBag,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Ruler,
  ShieldCheck,
  Clock,
  ArrowRight,
  X,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const product = LUXURY_CATALOG.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  // Component state
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || "Default"
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes[0] || "M"
  );
  const [includeBackupSize, setIncludeBackupSize] = useState<boolean>(true);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Accordion open states
  const [openAccordion, setOpenAccordion] = useState<string | null>("how-it-works");

  const addToStandardBag = useDualCartStore((s) => s.addToStandardBag);
  const addToTryHaulBox = useDualCartStore((s) => s.addToTryHaulBox);
  const addBackupSizeToHaul = useDualCartStore((s) => s.addBackupSizeToHaul);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Determine next size up for backup comparison
  const sizeOrder: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];
  const currentSizeIndex = sizeOrder.indexOf(selectedSize);
  const nextSizeUp: ProductSize | null =
    currentSizeIndex < sizeOrder.length - 1
      ? sizeOrder[currentSizeIndex + 1]
      : currentSizeIndex > 0
      ? sizeOrder[currentSizeIndex - 1]
      : null;

  // Check inventory stock status for current selection
  const isSizeInStock = (size: ProductSize) => {
    const inv = product.inventory.find(
      (v) => v.size === size && v.color === selectedColor
    );
    return !inv || inv.stockCount > 0;
  };

  // Handlers
  const handleAddToBag = () => {
    addToStandardBag({
      productId: product.id,
      product,
      selectedSize,
      selectedColor,
      quantity: 1,
    });
    showToast(`Added ${product.name} (${selectedSize}) to Bag`);
  };

  const handleTryAtHome = () => {
    if (!product.isTryHaulEligible) {
      showToast("This piece is available for standard purchase only.");
      return;
    }

    const res = addToTryHaulBox({
      productId: product.id,
      product,
      selectedSize,
      selectedColor,
    });

    if (!res.success && res.error) {
      showToast(res.error);
      return;
    }

    // Add backup size if checked
    if (includeBackupSize && nextSizeUp && res.itemId) {
      const backupRes = addBackupSizeToHaul(res.itemId, nextSizeUp);
      if (backupRes.success) {
        showToast(
          `Added ${product.name} (Sizes ${selectedSize} & ${nextSizeUp}) to Try at Home Box`
        );
      } else {
        showToast(`Added ${product.name} (${selectedSize}) to Try at Home Box`);
      }
    } else {
      showToast(`Added ${product.name} (${selectedSize}) to Try at Home Box`);
    }
  };

  // Related products
  const relatedProducts = LUXURY_CATALOG.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col font-sans">
      <Navbar />

      {/* Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 bg-[#111111] text-white text-xs font-medium uppercase tracking-wider shadow-2xl flex items-center gap-3 border border-[#333333]">
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E5E0] max-w-xl w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-[#666666] hover:text-[#111111]"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#666666] block mb-1">
              Measurement Protocol
            </span>
            <h3 className="text-xl font-normal text-[#111111] uppercase tracking-tight mb-4">
              Size & Fit Guide
            </h3>

            <p className="text-xs text-[#666666] mb-6 leading-relaxed">
              All our pieces are cut in a contemporary relaxed silhouette. If you are between sizes, we recommend ordering your usual size and checking the complimentary backup size option to test both at home.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#E5E5E0]">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#E5E5E0] text-[#666666] uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest (in)</th>
                    <th className="py-2.5 px-3">Waist (in)</th>
                    <th className="py-2.5 px-3">Hips (in)</th>
                    <th className="py-2.5 px-3">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E0] font-sans">
                  {[
                    { s: "XS", c: "34 - 36", w: "28 - 30", h: "35 - 37", l: "27.5" },
                    { s: "S", c: "36 - 38", w: "30 - 32", h: "37 - 39", l: "28.5" },
                    { s: "M", c: "38 - 40", w: "32 - 34", h: "39 - 41", l: "29.5" },
                    { s: "L", c: "41 - 43", w: "34 - 36", h: "42 - 44", l: "30.5" },
                    { s: "XL", c: "44 - 46", w: "37 - 39", h: "45 - 47", l: "31.5" },
                    { s: "XXL", c: "47 - 49", w: "40 - 42", h: "48 - 50", l: "32.0" },
                  ].map((row) => (
                    <tr
                      key={row.s}
                      className={row.s === selectedSize ? "bg-[#F4F4F0] font-semibold" : ""}
                    >
                      <td className="py-2.5 px-3 font-semibold">{row.s}</td>
                      <td className="py-2.5 px-3">{row.c}</td>
                      <td className="py-2.5 px-3">{row.w}</td>
                      <td className="py-2.5 px-3">{row.h}</td>
                      <td className="py-2.5 px-3">{row.l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5E0] flex justify-end">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="px-6 py-2 bg-[#111111] text-white text-xs uppercase tracking-wider font-semibold"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 pb-4">
        <nav className="flex items-center text-[11px] text-[#666666] uppercase tracking-[0.15em] gap-2">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#111111] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-[#111111] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main PDP Grid: 60% Left Gallery, 40% Right Sticky Panel */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column (60%): Vertical Stacking Editorial Studio Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {product.images.map((imgSrc, index) => (
              <div
                key={index}
                className="relative aspect-[3/4] w-full bg-[#F4F4F0] border border-[#E5E5E0] overflow-hidden group"
              >
                <Image
                  src={imgSrc}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#111111] font-medium border border-[#E5E5E0]">
                  Studio Shot 0{index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (40%): Sticky Purchasing & Try at Home Drawer */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6 bg-white p-6 sm:p-8 border border-[#E5E5E0]">
              {/* Product Header */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#666666] mb-1">
                  <span className="uppercase tracking-[0.2em] font-medium">
                    {product.category} • {product.sku}
                  </span>
                  {product.isTryHaulEligible && (
                    <span className="inline-flex items-center gap-1 text-[#15803D] font-semibold text-[11px] uppercase tracking-wider">
                      <Box className="w-3.5 h-3.5" />
                      Try at Home Eligible
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-normal text-[#111111] uppercase tracking-tight mt-1">
                  {product.name}
                </h1>

                <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
                  {product.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-4 pb-4 border-b border-[#E5E5E0] flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-normal text-[#111111] tabular-nums">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-[#888888] ml-2 font-normal">
                      Tax included
                    </span>
                  </div>
                  <span className="text-[11px] text-[#15803D] font-medium">
                    Complimentary Express Shipping
                  </span>
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="text-[#666666] uppercase tracking-wider text-[11px]">
                    Color:
                  </span>
                  <span className="font-semibold text-[#111111] text-xs">
                    {selectedColor}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`relative w-8 h-8 rounded-none border transition-all flex items-center justify-center ${
                          isSelected
                            ? "border-[#111111] ring-1 ring-[#111111] ring-offset-2"
                            : "border-[#D1D1CB] hover:border-[#888888]"
                        }`}
                        title={color.name}
                      >
                        <span
                          className="w-full h-full block"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#666666] uppercase tracking-wider text-[11px]">
                      Select Size:
                    </span>
                    <span className="font-semibold text-[#111111] text-xs">
                      {selectedSize}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[11px] uppercase tracking-wider text-[#111111] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const inStock = isSizeInStock(size);

                    return (
                      <button
                        key={size}
                        disabled={!inStock}
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 text-xs uppercase font-medium border transition-all flex items-center justify-center ${
                          !inStock
                            ? "border-[#E5E5E0] text-[#BBBBBB] bg-[#FAFAFA] line-through cursor-not-allowed"
                            : isSelected
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-[#E5E5E0] text-[#111111] bg-white hover:border-[#111111]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Free Backup Size Comparison Box (Try at Home Advantage) */}
              {product.isTryHaulEligible && nextSizeUp && (
                <div className="p-3.5 bg-[#FAF9F6] border border-[#E5E5E0] flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="backup-size-checkbox"
                    checked={includeBackupSize}
                    onChange={(e) => setIncludeBackupSize(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-none border-[#111111] text-[#111111] focus:ring-0 accent-[#111111] cursor-pointer"
                  />
                  <label
                    htmlFor="backup-size-checkbox"
                    className="text-xs text-[#111111] cursor-pointer leading-tight select-none"
                  >
                    <span className="font-semibold block mb-0.5">
                      Complimentary Backup Size ({nextSizeUp})
                    </span>
                    <span className="text-[#666666] text-[11px] block">
                      Also pack size {nextSizeUp} into your Try at Home box at ₹0. Compare both fits at your doorstep and hand back the other.
                    </span>
                  </label>
                </div>
              )}

              {/* Dual Primary CTAs */}
              <div className="flex flex-col gap-3 pt-2">
                {/* 1. Solid Black Button: Buy Now */}
                <button
                  onClick={handleAddToBag}
                  className="w-full py-4 bg-[#111111] hover:bg-[#262626] text-white text-xs uppercase tracking-[0.18em] font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag — ₹{product.price.toLocaleString("en-IN")}</span>
                </button>

                {/* 2. Outlined Crisp Button: Try at Home for ₹0 */}
                {product.isTryHaulEligible && (
                  <button
                    onClick={handleTryAtHome}
                    className="w-full py-4 bg-white hover:bg-[#FAF9F6] text-[#111111] text-xs uppercase tracking-[0.18em] font-semibold border-2 border-[#111111] transition-colors flex items-center justify-center gap-2 group"
                  >
                    <Box className="w-4 h-4 text-[#15803D]" />
                    <span>Try at Home for ₹0</span>
                    <span className="text-[10px] bg-[#15803D] text-white px-1.5 py-0.5 font-normal tracking-normal ml-1">
                      20 Min Doorstep Fitting
                    </span>
                  </button>
                )}
              </div>

              {/* Plain English Reassurance */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E5E0] text-[11px] text-[#666666]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#111111]" />
                  <span>60-Min Express Slot</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
                  <span>100% Refund Guarantee</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-[#E5E5E0] divide-y divide-[#E5E5E0] pt-2">
                {/* Accordion 1: How Try at Home Works */}
                <div>
                  <button
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "how-it-works" ? null : "how-it-works"
                      )
                    }
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#111111]"
                  >
                    <span>How Try at Home Works</span>
                    {openAccordion === "how-it-works" ? (
                      <ChevronUp className="w-4 h-4 text-[#666666]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#666666]" />
                    )}
                  </button>
                  {openAccordion === "how-it-works" && (
                    <div className="pb-4 text-xs text-[#666666] leading-relaxed space-y-2">
                      <p>
                        <strong className="text-[#111111]">1. Select up to 5 items:</strong> Add your favorite garments and free backup sizes to your box. Pay ₹0 for clothes now (only ₹199 refundable trial deposit).
                      </p>
                      <p>
                        <strong className="text-[#111111]">2. 20-minute doorstep fitting:</strong> Our delivery partner arrives at your address and waits outside while you try garments in your home.
                      </p>
                      <p>
                        <strong className="text-[#111111]">3. Keep only what fits:</strong> Keep what you love, hand back what you don&apos;t. The ₹199 deposit is 100% adjusted if you purchase any item, or refunded if you return all.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Fabric, Fit & Care */}
                <div>
                  <button
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "fabric-care" ? null : "fabric-care"
                      )
                    }
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#111111]"
                  >
                    <span>Fabric, Fit & Care</span>
                    {openAccordion === "fabric-care" ? (
                      <ChevronUp className="w-4 h-4 text-[#666666]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#666666]" />
                    )}
                  </button>
                  {openAccordion === "fabric-care" && (
                    <div className="pb-4 text-xs text-[#666666] leading-relaxed space-y-2">
                      <p>
                        <strong className="text-[#111111]">Composition:</strong> {product.materialComposition}
                      </p>
                      <p>
                        <strong className="text-[#111111]">Fit:</strong> Designed for an architectural, relaxed drape. True to luxury European sizing.
                      </p>
                      <p>
                        <strong className="text-[#111111]">Care:</strong> {product.careInstructions}
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Shipping & Returns */}
                <div>
                  <button
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "shipping" ? null : "shipping"
                      )
                    }
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#111111]"
                  >
                    <span>Shipping, Delivery & Returns</span>
                    {openAccordion === "shipping" ? (
                      <ChevronUp className="w-4 h-4 text-[#666666]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#666666]" />
                    )}
                  </button>
                  {openAccordion === "shipping" && (
                    <div className="pb-4 text-xs text-[#666666] leading-relaxed space-y-2">
                      <p>
                        Express Doorstep Trial dispatched within 60 minutes in metro delivery zones.
                      </p>
                      <p>
                        Standard online purchases are delivered within 48 to 72 hours with complimentary 14-day home pickup returns.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look / Related Products (4-column studio grid) */}
        <section className="mt-24 pt-16 border-t border-[#E5E5E0]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#666666] block mb-1">
                Curated Harmonies
              </span>
              <h2 className="text-xl sm:text-2xl font-normal text-[#111111] uppercase tracking-tight">
                Complete The Look
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-[0.15em] text-[#111111] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="group relative flex flex-col bg-white border border-[#E5E5E0] hover:border-[#111111] transition-all"
              >
                <Link
                  href={`/shop/${rel.id}`}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F4F0] block"
                >
                  <Image
                    src={rel.images[0]}
                    alt={rel.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {rel.isTryHaulEligible && (
                    <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-white text-[#15803D] border border-[#15803D]">
                      Try at Home
                    </span>
                  )}
                </Link>

                <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#666666] block mb-1">
                      {rel.category}
                    </span>
                    <Link
                      href={`/shop/${rel.id}`}
                      className="text-xs font-semibold text-[#111111] uppercase tracking-wider hover:underline line-clamp-1"
                    >
                      {rel.name}
                    </Link>
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#E5E5E0] flex items-center justify-between">
                    <span className="text-xs text-[#888888]">
                      {rel.sizes.length} sizes
                    </span>
                    <span className="text-sm font-semibold text-[#111111] tabular-nums">
                      ₹{rel.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
