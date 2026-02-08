import React from "react";
import { formatTokenAmount } from "@/lib/trading/utils";
import { Token } from "@/lib/trading/constants";

interface SwapInputProps {
  label: string;
  amount: string;
  setAmount?: (val: string) => void;
  token: Token | undefined;
  tokens: Token[];
  onSelectToken: (symbol: string) => void;
  balance?: bigint;
  usdValue?: string;
  readOnly?: boolean;
  onMax?: () => void;
  error?: string;
}

export const SwapInput: React.FC<SwapInputProps> = ({
  label,
  amount,
  setAmount,
  token,
  tokens,
  onSelectToken,
  balance,
  usdValue,
  readOnly = false,
  onMax,
  error,
}) => {
  return (
    <div className="bg-[#141414] border border-cyan-500/15 rounded-lg p-4 transition-colors hover:border-cyan-500/30">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-normal text-[#A3A3A3]" style={{ fontFamily: "Space Grotesk" }}>
          {label}
        </label>
        <div className="text-right text-xs">
          {balance !== undefined && token ? (
             <span className="text-[#A3A3A3]">
                Balance: <span className="text-white">{formatTokenAmount(balance, token.decimals)}</span>
             </span>
          ) : (
            <span className="text-[#A3A3A3]">-</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Token Selector */}
        <div className="relative min-w-[120px]">
           <select
              value={token?.symbol || ""}
              onChange={(e) => onSelectToken(e.target.value)}
              className="w-full appearance-none bg-[#1E1E1E] border border-cyan-500/20 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#06b6d4] pr-8"
              style={{ fontFamily: "Space Grotesk" }}
           >
              {tokens.map(t => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
           </select>
           {/* Custom Arrow */}
           <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#06b6d4]">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
           </div>
        </div>

        {/* Amount Input */}
        <input
          type="text"
          value={amount}
          onChange={(e) => {
             const val = e.target.value;
             // Allow decimals
             if (/^\d*\.?\d*$/.test(val) || val === "") {
                 setAmount && setAmount(val);
             }
          }}
          readOnly={readOnly}
          placeholder="0.0"
          className="flex-1 bg-transparent text-right text-2xl font-normal text-white placeholder-[#333] focus:outline-none"
          style={{ fontFamily: "Space Grotesk" }}
        />
      </div>

      <div className="flex justify-between items-center mt-3"> 
          <div className="text-xs text-[#A3A3A3]">
              ≈ ${usdValue || "0.00"}
          </div>
          {onMax && !readOnly && balance !== undefined && (
              <button 
                onClick={onMax}
                className="text-xs font-bold text-[#06b6d4] hover:text-[#22d3ee] uppercase tracking-wider transform active:scale-95 transition-transform"
              >
                  MAX
              </button>
          )}
      </div>
      
      {error && (
          <div className="mt-2 text-xs text-red-500 font-normal">
              {error}
          </div>
      )}
    </div>
  );
};
