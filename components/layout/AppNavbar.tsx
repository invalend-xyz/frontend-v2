"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

import { navigationItems } from "@/lib/utils/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

export default function AppNavbar() {
  const ConnectWallet = dynamic(
    () =>
      import("@/components/web3/ConnectWallet").then(
        (mod) => mod.ConnectWallet,
      ),
    {
      ssr: false,
    },
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = useMemo(
    () => (href?: string) =>
      href ? pathname === href || pathname.startsWith(`${href}/`) : false,
    [pathname],
  );

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-cyan-500/15"
        role="navigation"
        aria-label="Application navigation">
        <div className="px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-80">
              <Image
                src="/Invalend.png"
                alt="Invalend"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span
                className="text-xl font-medium text-white"
                style={{
                  fontFamily: "Space Grotesk",
                  letterSpacing: "-0.5px",
                }}>
                Invalend
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1" role="menubar">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href ?? "#"}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 group ${
                      active
                        ? "text-[#06b6d4]"
                        : "text-[#A3A3A3] hover:text-white"
                    }`}
                    style={{ fontFamily: "Space Grotesk" }}
                    role="menuitem"
                    aria-label={`Navigate to ${item.label}`}>
                    <Icon
                      className={`w-4 h-4 transition-all duration-300 ${
                        active
                          ? "text-[#06b6d4]"
                          : "text-[#A3A3A3] group-hover:text-white"
                      }`}
                      aria-hidden={true}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-normal">{item.label}</span>
                    </div>

                    {/* Active Indicator */}
                    {active && (
                      <div
                        className="absolute inset-0 rounded-lg border transition-all duration-300"
                        style={{ borderColor: "rgba(6, 182, 212, 0.15)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Connect Wallet & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Connect Wallet */}
              <div className="hidden sm:block">
                <ConnectWallet />
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden w-6 h-6 transition-colors duration-300 hover:text-[#06b6d4]"
                style={{ color: "#FFFFFF" }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={
                  isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu">
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden={true} />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden={true} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden absolute top-full left-0 right-0 bg-[#0A0A0A] border-b border-cyan-500/15"
            role="menu"
            aria-label="Mobile navigation menu">
            <div className="px-6 sm:px-8 py-4 space-y-3">
              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href ?? "#"}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                      active
                        ? "text-[#06b6d4] bg-[#1E1E1E]"
                        : "text-[#A3A3A3] hover:text-white hover:bg-[#1E1E1E]"
                    }`}
                    style={{ fontFamily: "Space Grotesk" }}
                    role="menuitem"
                    aria-label={`Navigate to ${item.label}`}
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Icon
                      className={`w-4 h-4 transition-all duration-300 ${
                        active
                          ? "text-[#06b6d4]"
                          : "text-[#A3A3A3] group-hover:text-white"
                      }`}
                      aria-hidden={true}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-normal">{item.label}</span>
                      <span className="text-xs font-normal opacity-70">
                        {item.description}
                      </span>
                    </div>
                    {active && (
                      <ArrowRight
                        className="w-4 h-4 ml-auto text-[#06b6d4]"
                        aria-hidden={true}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Mobile Connect Wallet */}
              <div className="pt-4 border-t border-cyan-500/15">
                <ConnectWallet />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#06b6d4] focus:text-[#0A0A0A] focus:rounded-lg focus:font-normal"
        style={{ fontFamily: "Space Grotesk" }}>
        Skip to main content
      </a>
    </>
  );
}
