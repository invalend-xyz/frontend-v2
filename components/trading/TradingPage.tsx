"use client";

import React, { useState } from "react";
import { useTradingHooks, useRestrictedWalletBalance } from "../../hooks/contracts/useTrading";
import { TOKENS } from "../../lib/trading/constants";
import { calculateMinAmountOut, calculateUSDValue, formatTokenAmount } from "../../lib/trading/utils";
import { formatUnits, parseUnits } from "viem";

// New Components
import { TradingHeader } from "./TradingHeader";
import { SwapCard } from "./SwapCard";
import { SwapSummary } from "./SwapSummary";
import { TransactionNotification } from "@/components/ui/TransactionNotification";

export const TradingPage: React.FC = () => {
  // --- Hooks & State ---
  const {
      address,
      executeSwap,
      restrictedWalletAddress,
      hasActiveLoan,
      isPending,
      isSuccess,
      error: hookError,
      resetStates,
      refetchLoanInfo
  } = useTradingHooks();

  const [selectedTokenIn, setSelectedTokenIn] = useState<string>("USDC");
  const [selectedTokenOut, setSelectedTokenOut] = useState<string>("ETH");
  const [tradeAmount, setTradeAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<string>("0.5");

  // Tokens
  const tokenIn = TOKENS[selectedTokenIn];
  const tokenOut = TOKENS[selectedTokenOut];
  const tokens = Object.values(TOKENS);

  // Balances
  const { data: balanceIn } = useRestrictedWalletBalance(tokenIn?.address || "", restrictedWalletAddress);
  const { data: balanceOut } = useRestrictedWalletBalance(tokenOut?.address || "", restrictedWalletAddress);

  // Calculations
  const estimatedOutput = (tradeAmount && tokenIn.price && tokenOut.price) 
       ? calculateMinAmountOut(tradeAmount, tokenIn, tokenOut, 0) // Raw estimate without slippage for display
       : "0";

  const usdValueIn = calculateUSDValue(tradeAmount, tokenIn) || "0.00";
  const usdValueOut = calculateUSDValue(estimatedOutput, tokenOut) || "0.00";
  
  // Validation
  const insufficientBalance = balanceIn ? (parseUnits(tradeAmount || "0", tokenIn.decimals) > balanceIn) : false;
  const isValid = 
      !!tradeAmount && 
      parseFloat(tradeAmount) > 0 && 
      !insufficientBalance && 
      !!restrictedWalletAddress;

  // Handlers
  const handleSwapSwitch = () => {
      setSelectedTokenIn(selectedTokenOut);
      setSelectedTokenOut(selectedTokenIn);
      setTradeAmount(""); 
  };

  const handleExecute = async () => {
      if (!isValid) return;
      try {
          await executeSwap(tokenIn, tokenOut, tradeAmount, parseFloat(slippage));
      } catch (e) {
          console.error(e);
      }
  };

  // Derived display values
  const parsePrice = (price?: string) => price ? parseFloat(price.replace(/,/g, '')) : 0;
  const priceIn = parsePrice(tokenIn.price);
  const priceOut = parsePrice(tokenOut.price);

  const rate = (priceIn && priceOut) 
      ? (priceIn / priceOut).toFixed(6)
      : "-";
  
  const minReceived = (tradeAmount && priceIn && priceOut)
      ? calculateMinAmountOut(tradeAmount, tokenIn, tokenOut, parseFloat(slippage))
      : "0";


  return (
    <div className="max-w-6xl mx-auto space-y-6">
       {/* Header */}
       <TradingHeader 
          restrictedWalletAddress={restrictedWalletAddress}
          isActive={hasActiveLoan}
       />
       
       {!restrictedWalletAddress ? (
           <div className="bg-[#141414] border border-cyan-400/20 rounded-xl p-8 text-center max-w-2xl mx-auto mt-12">
               <div className="w-16 h-16 bg-cyan-400/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                   💡
               </div>
               <h2 className="text-xl text-white mb-2" style={{fontFamily: "Space Grotesk"}}>Open a Position to Trade</h2>
               <p className="text-[#A3A3A3] mb-6">
                   You need to borrow USDC first to create a trading wallet. Your borrowed funds will be available for swapping here.
               </p>
               {/* Could add button to go to Loan page */}
           </div>
       ) : (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Swap Interface */}
              <div className="lg:col-span-2">
                  <SwapCard
                      tokenIn={tokenIn}
                      tokenOut={tokenOut}
                      tokens={tokens}
                      tradeAmount={tradeAmount}
                      setTradeAmount={setTradeAmount}
                      estimatedOutput={estimatedOutput}
                      slippage={slippage}
                      setSlippage={setSlippage}
                      onSelectTokenIn={setSelectedTokenIn}
                      onSelectTokenOut={setSelectedTokenOut}
                      onSwapSwitch={handleSwapSwitch}
                      onExecute={handleExecute}
                      isExecuting={isPending}
                      isValid={isValid}
                      error={insufficientBalance ? "Insufficient Balance" : hookError}
                      userBalanceIn={balanceIn}
                      userBalanceOut={balanceOut}
                      usdValueIn={usdValueIn}
                      usdValueOut={usdValueOut}
                  />
                <button
                  onClick={() => refetchLoanInfo()}
                  className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-400/30 rounded text-cyan-300 hover:text-cyan-200 transition-all duration-200 text-sm font-normal transform active:scale-95"
                  style={{ fontFamily: "Space Grotesk" }}>
                  Refresh Status
                </button>
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                  <SwapSummary
                      tokenIn={tokenIn}
                      tokenOut={tokenOut}
                      rate={rate}
                      fee="0.005" // Mock fee
                      minReceived={minReceived}
                  />
              </div>
           </div>
       )}

       {/* Notifications */}
       {isPending && (
           <TransactionNotification
               status="pending"
               hash={undefined} // We might get hash from hook if exposed, usually hook handles it internally or returns it
               message="Swapping tokens..."
               onClose={() => {}} // Block close?
           />
       )}
       {isSuccess && (
           <TransactionNotification
               status="success"
               hash={undefined}
               message="Swap Successful!"
               onClose={resetStates}
           />
       )}
    </div>
  );
};
