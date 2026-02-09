import React from "react";
import { ExplorerLink } from "@/components/ui/ExplorerLink";

interface TradingHeaderProps {
  restrictedWalletAddress: string | null;
  isActive: boolean;
}

export const TradingHeader: React.FC<TradingHeaderProps> = ({
  restrictedWalletAddress,
  isActive,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1
          className="text-2xl font-normal text-white mb-2"
          style={{ fontFamily: "Space Grotesk", letterSpacing: "-0.5px" }}>
          Swap Tokens
        </h1>
        <p
          className="text-[#A3A3A3] text-sm font-normal"
          style={{ fontFamily: "Space Grotesk" }}>
          Trade from your leveraged wallet via Aerodrome DEX
        </p>
      </div>

      {isActive && restrictedWalletAddress ? (
        <div className="flex flex-col items-end">
          <div
            className="px-4 py-1.5 rounded-full border bg-green-500/10 border-green-500/30 text-green-500 text-sm font-medium mb-1"
            style={{ fontFamily: "Space Grotesk" }}>
            Ready to Trade
          </div>
          <ExplorerLink
            address={restrictedWalletAddress}
            className="text-xs text-[#A3A3A3]"
          />
        </div>
      ) : (
        <div
          className="px-4 py-1.5 rounded-full border bg-cyan-400/10 border-cyan-400/30 text-cyan-400 text-sm font-medium"
          style={{ fontFamily: "Space Grotesk" }}>
          No Active Position
        </div>
      )}
    </div>
  );
};
