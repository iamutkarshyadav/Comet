"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="boutiques" className="border-t border-[#E5E5E0] bg-[#FAF9F6] py-16 text-[#666666] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-[0.24em] uppercase text-[#111111]">
              Aura / Noir
            </span>
            <p className="text-[#666666] leading-relaxed">
              Architectural luxury garments tailored from unadulterated natural noble fibers. On-demand doorstep trial available across primary metropolitan zones.
            </p>
            <div className="text-[11px] text-[#111111] font-medium pt-2">
              Boutiques: New Delhi • Mumbai • Milan
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-[#111111] uppercase tracking-[0.2em] text-[11px] font-semibold mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop?cat=outerwear" className="hover:text-[#111111] transition-colors">
                  Double-Faced Outerwear
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=knitwear" className="hover:text-[#111111] transition-colors">
                  Mongolian Cashmere & Heavy Knits
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=trousers" className="hover:text-[#111111] transition-colors">
                  Japanese Wool Pleated Trousers
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=t-shirts" className="hover:text-[#111111] transition-colors">
                  Heavyweight 280GSM Combed Tees
                </Link>
              </li>
            </ul>
          </div>

          {/* Doorstep Fitting Protocol */}
          <div>
            <h4 className="text-[#111111] uppercase tracking-[0.2em] text-[11px] font-semibold mb-4">
              Doorstep Fitting
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#how-try-at-home-works" className="hover:text-[#111111] transition-colors">
                  How Try at Home Works
                </Link>
              </li>
              <li>
                <span className="text-[#666666]">
                  60-Minute Express Dispatch
                </span>
              </li>
              <li>
                <span className="text-[#666666]">
                  20-Minute In-Home Trial Window
                </span>
              </li>
              <li>
                <span className="text-[#666666]">
                  On-the-Spot Sizing Exchange
                </span>
              </li>
              <li>
                <span className="text-[#666666]">
                  ₹0 Upfront Product Charges
                </span>
              </li>
            </ul>
          </div>

          {/* Concierge & Assistance */}
          <div>
            <h4 className="text-[#111111] uppercase tracking-[0.2em] text-[11px] font-semibold mb-4">
              Concierge
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-[#666666]">
                  concierge@auranoir-atelier.com
                </span>
              </li>
              <li>
                <span className="text-[#666666]">
                  +91 (011) 4920-8800 (Mon – Sat, 10 AM – 8 PM)
                </span>
              </li>
              <li>
                <span className="text-[#666666]">
                  Complimentary Priority Courier over ₹15,000
                </span>
              </li>
              <li>
                <span className="text-[#666666]">
                  30-Day Archival Return Protocol
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E5E5E0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#888888]">
          <div>
            © {new Date().getFullYear()} AURA / NOIR ATELIER. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6">
            <span>Terms of Service</span>
            <span>Privacy Protocol</span>
            <span>Doorstep Trial Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
