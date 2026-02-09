import React from "react";
import { SwapInput } from "./SwapInput";
import { ActionButton } from "@/components/ui/TransactionButton";
import { Token } from "@/lib/trading/constants";

interface SwapCardProps {
  tokenIn: Token;
  tokenOut: Token;
  tokens: Token[];
  tradeAmount: string;
  setTradeAmount: (val: string) => void;
  estimatedOutput: string;
  slippage: string;
  setSlippage: (val: string) => void;
  onSelectTokenIn: (symbol: string) => void;
  onSelectTokenOut: (symbol: string) => void;
  onSwapSwitch: () => void;
  onExecute: () => void;
  isExecuting: boolean;
  isValid: boolean;
  error?: string;
  userBalanceIn?: bigint;
  userBalanceOut?: bigint;
  usdValueIn: string;
  usdValueOut: string;
}

export const SwapCard: React.FC<SwapCardProps> = ({
  tokenIn,
  tokenOut,
  tokens,
  tradeAmount,
  setTradeAmount,
  estimatedOutput,
  slippage,
  setSlippage,
  onSelectTokenIn,
  onSelectTokenOut,
  onSwapSwitch,
  onExecute,
  isExecuting,
  isValid,
  error,
  userBalanceIn,
  userBalanceOut,
  usdValueIn,
  usdValueOut
}) => {
  return (
    <div className="bg-[#1E1E1E] border border-cyan-500/15 rounded-xl p-6 relative">
      <div className="space-y-2">
        <SwapInput
          label="You Pay"
          amount={tradeAmount}
          setAmount={setTradeAmount}
          token={tokenIn}
          tokens={tokens}
          onSelectToken={onSelectTokenIn}
          balance={userBalanceIn}
          usdValue={usdValueIn}
          onMax={() => {
              // Basic max logic (handled by parent or here if we have decimals)
              // For simplicity, let parent handle or just format here if we had format utils.
              // Logic usually moved to container. For now, we assume parent passed filtered handler or we add logic.
              // Actually, SwapInput onMax calls callback. Container logic needed.
              // I'll update SwapInput to just emit event.
          }} // Logic to be implemented in container or simple placeholder
        />

        {/* Switch Button */}
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-10">
            <button 
                onClick={onSwapSwitch}
                className="bg-[#141414] border border-cyan-500/30 p-2 rounded-lg hover:bg-[#252525] hover:border-[#06b6d4] transition-all text-[#06b6d4] transform active:scale-95"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </div>

        <SwapInput
          label="You Receive"
          amount={estimatedOutput}
          token={tokenOut}
          tokens={tokens}
          onSelectToken={onSelectTokenOut}
          balance={userBalanceOut}
          usdValue={usdValueOut}
          readOnly={true}
        />
      </div>

       {/* Slippage & Details */}
       <div className="mt-6 mb-6 space-y-3">
           <div className="flex justify-between items-center text-sm">
               <span className="text-[#A3A3A3]" style={{fontFamily: "Space Grotesk"}}>Slippage Tolerance</span>
               <div className="flex items-center gap-2">
                   {["0.5", "1.0", "2.0"].map(val => (
                       <button
                          key={val}
                          onClick={() => setSlippage(val)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${slippage === val ? "bg-[#06b6d4] text-black font-bold" : "bg-[#141414] text-[#A3A3A3] hover:text-white"}`}
                        >
                           {val}%
                       </button>
                   ))}
               </div>
           </div>
       </div>

       {/* Action Button */}
       <ActionButton
          onClick={onExecute}
          disabled={!isValid || isExecuting}
          loading={isExecuting}
          className="w-full text-lg py-4"
        >
            {isExecuting ? "Swapping..." : `Swap ${tokenIn?.symbol || ''} for ${tokenOut?.symbol || ''}`}
        </ActionButton>
        
        {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-500 text-sm text-center">
                {error}
            </div>
        )}
    </div>
  );
};
