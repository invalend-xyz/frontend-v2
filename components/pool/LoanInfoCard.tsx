"use client";

import { StatusCard } from "@/components/ui/StatusCard";

export const LoanInfoCard = () => {
  return (
    <StatusCard title="How It Works">
      <div className="space-y-4 text-sm">
        <div className="space-y-2">
          <h4 className="text-white font-medium">1. Deposit Collateral</h4>
          <p className="text-gray-400">
            Provide USDC as collateral to secure your loan. The required amount
            depends on your desired leverage.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-white font-medium">2. Borrow USDC</h4>
          <p className="text-gray-400">
            Receive borrowed USDC plus additional leverage from the lending
            pool into your trading wallet.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-white font-medium">
            3. Trade with Leverage
          </h4>
          <p className="text-gray-400">
            Use your trading wallet to swap tokens on Aerodrome DEX. Only
            whitelisted tokens are supported.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-white font-medium">4. Repay to Withdraw</h4>
          <p className="text-gray-400">
            Close your position anytime by repaying the loan. Your collateral
            and any profits will be returned.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-cyan-500/15">
        <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h5 className="text-cyan-400 font-medium text-sm">Risk Notice</h5>
              <p className="text-cyan-400/80 text-xs mt-1">
                Monitor your position closely. Ensure you can repay before
                market movements affect your collateral.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StatusCard>
  );
};
