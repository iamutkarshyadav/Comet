"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Box, Clock, ShieldCheck } from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
}

export function Hero({ onExploreClick, onHowItWorksClick }: HeroProps) {
  return (
    <section className="relative bg-[#FAF9F6] border-b border-[#E5E5E0]">
      {/* Editorial Hero Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-block border-b border-[#111111] pb-1">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#111111]">
                Spring / Summer 2026 Atelier
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#111111] leading-[1.08] uppercase">
              Form follows <br />
              <span className="font-serif italic font-normal text-[#666666]">
                proportion.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#666666] max-w-xl leading-relaxed">
              Architectural tailoring cut from unadulterated Mongolian cashmere, Japanese wool-gabardine, and heavyweight spun cotton. Try them in the comfort of your home before deciding what to keep.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-8 py-4 rounded-none bg-[#111111] text-white text-xs font-medium uppercase tracking-[0.18em] hover:bg-[#333333] transition-all flex items-center gap-2"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="px-8 py-4 rounded-none border border-[#111111] text-[#111111] text-xs font-medium uppercase tracking-[0.18em] hover:bg-[#111111] hover:text-white transition-all flex items-center gap-2"
              >
                <Box className="w-3.5 h-3.5 text-[#15803D]" />
                <span>How Try at Home Works</span>
              </button>
            </div>

            {/* Clean Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[#E5E5E0]">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                  <Box className="w-4 h-4 text-[#15803D]" />
                  <span>Doorstep Fitting</span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Select up to 5 items. Pay ₹0 upfront for clothes and try them on at home.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                  <Clock className="w-4 h-4 text-[#111111]" />
                  <span>20-Minute Window</span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Our delivery partner waits at your door while you inspect fit and fabric.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#111111]" />
                  <span>Instant Exchange</span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Swap sizes on the spot or return unwanted items with zero hassle.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Portrait Photography */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full border border-[#E5E5E0] bg-[#EAE8E2] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=1200&q=80"
                alt="Aura Atelier Spring 2026 Collection"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#111111] border border-[#E5E5E0]">
                Look 01 — Mongolian Cashmere Overcoat
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
