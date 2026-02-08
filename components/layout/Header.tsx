"use client";
import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="bg-[#0A0A0A] border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/Invalend.png"
              alt="Invalend"
              width={32}
              height={32}
              className="rounded-lg transition-all duration-300 group-hover:scale-105"
            />
            <div className="flex items-center gap-3">
              <span
                className="text-xl font-medium text-white transition-colors duration-300"
                style={{
                  fontFamily: "Space Grotesk",
                  letterSpacing: "-0.5px",
                }}>
                Invalend
              </span>
              <span
                className="text-sm text-[#A3A3A3] bg-[#1E1E1E] px-3 py-1 rounded-lg border border-cyan-500/15"
                style={{ fontFamily: "Space Grotesk" }}>
                PoC
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
