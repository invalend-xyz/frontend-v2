import React from "react";
import { Token } from "@/lib/trading/constants";

interface SwapSummaryProps {
  tokenIn: Token;
  tokenOut: Token;
  rate: string; // tokenIn per tokenOut or vice versa
  fee: string;
  minReceived: string;
}

export const SwapSummary: React.FC<SwapSummaryProps> = ({
  tokenIn,
  tokenOut,
  rate,
  fee,
  minReceived,
}) => {
  return (
    <div className="bg-[#141414] border border-cyan-500/15 rounded-xl p-6 h-fit sticky top-6">
      <h3
        className="text-white text-lg font-normal mb-6"
        style={{ fontFamily: "Space Grotesk" }}>
        Order Summary
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#A3A3A3]">Exchange Rate</span>
          <span className="text-white font-mono">
            1 {tokenIn.symbol} ≈ {rate} {tokenOut.symbol}
          </span>
        </div>

        <div className="w-full h-[1px] bg-cyan-500/10"></div>

        <div className="flex justify-between text-sm">
          <span className="text-[#A3A3A3]">Network Fee</span>
          <span className="text-white font-mono">{fee} ETH</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#A3A3A3]">Minimum Received</span>
          <span className="text-white font-mono">
            {minReceived} {tokenOut.symbol}
          </span>
        </div>
      </div>
    </div>
  );
};
