"use client";

import { usePool } from "@/hooks/contracts/usePool";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const PoolStats = () => {
  const { poolStats, isLoading } = usePool();

  if (isLoading) {
    return (
      <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/15">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="lg" />
          <span
            className="ml-3 text-[#A3A3A3] font-normal"
            style={{ fontFamily: "Space Grotesk" }}>
            Loading pool stats...
          </span>
        </div>
      </div>
    );
  }

  if (!poolStats) {
    return (
      <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/15">
        <div
          className="text-center text-[#A3A3A3] font-normal"
          style={{ fontFamily: "Space Grotesk" }}>
          Failed to load pool statistics
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Supplied",
      value: poolStats.totalAllocated,
      unit: "USDC",
      description: "Total USDC supplied by lenders",
    },
    {
      label: "Available to Borrow",
      value: poolStats.availableLiquidity,
      unit: "USDC",
      description: "Liquidity available for new loans",
    },
    {
      label: "Currently Borrowed",
      value: poolStats.totalAllocated,
      unit: "USDC",
      description: "USDC lent out to borrowers",
    },
    {
      label: "Supply APY",
      value: poolStats.apy,
      unit: "",
      description: "Fixed annual yield for suppliers",
      highlight: true,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Pool Description */}
      <p
        className="text-[#A3A3A3] text-sm mb-4 font-normal"
        style={{ fontFamily: "Space Grotesk" }}>
        Supply USDC to earn a fixed 6% APY. Your funds provide liquidity for
        borrowers seeking leverage.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 border transition-all duration-300 ${
              stat.highlight
                ? "bg-[#06b6d4]/10 border-[#06b6d4]/30 hover:border-[#06b6d4]/50"
                : "bg-[#1E1E1E] border-cyan-500/15 hover:border-cyan-500/30"
            }`}>
            <div className="space-y-2">
              <div
                className="text-sm text-[#A3A3A3] font-normal"
                style={{ fontFamily: "Space Grotesk" }}>
                {stat.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-xl font-normal ${
                    stat.highlight ? "text-[#06b6d4]" : "text-white"
                  }`}
                  style={{
                    fontFamily: "Space Grotesk",
                    letterSpacing: "-0.5px",
                  }}>
                  {stat.value}
                </span>
                {stat.unit && (
                  <span
                    className="text-sm text-[#A3A3A3] font-normal"
                    style={{ fontFamily: "Space Grotesk" }}>
                    {stat.unit}
                  </span>
                )}
              </div>
              <div
                className="text-xs text-[#A3A3A3] font-normal"
                style={{ fontFamily: "Space Grotesk" }}>
                {stat.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pool Status */}
      <div className="bg-[#1E1E1E] rounded-lg p-4 border border-cyan-500/15">
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-white font-normal"
              style={{
                fontFamily: "Space Grotesk",
                letterSpacing: "-0.5px",
              }}>
              Pool Health
            </h3>
            <p
              className="text-sm text-[#A3A3A3] font-normal"
              style={{ fontFamily: "Space Grotesk" }}>
              {Number(poolStats.availableLiquidity) > 0
                ? "Pool is healthy and accepting new supplies and loans"
                : "Pool is at capacity - withdrawals may be limited"}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-normal ${
              Number(poolStats.availableLiquidity) > 0
                ? "bg-[#06b6d4]/20 text-[#06b6d4]"
                : "bg-red-400/20 text-red-400"
            }`}
            style={{ fontFamily: "Space Grotesk" }}>
            {Number(poolStats.availableLiquidity) > 0 ? "Active" : "Full"}
          </div>
        </div>
      </div>
    </div>
  );
};
