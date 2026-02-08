import React, { useState, useEffect } from "react";
import { formatUnits, parseUnits } from "viem";
import { ActionButton } from "@/components/ui/TransactionButton";
import { TokenConfig } from "./tokens";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: TokenConfig;
  balance: bigint;
  maxWithdrawable: bigint;
  isWithdrawing: boolean;
  onWithdraw: (amount: string, decimals: number) => Promise<void>;
  isUSDC: boolean;
  loanIsActive: boolean;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  token,
  balance,
  maxWithdrawable,
  isWithdrawing,
  onWithdraw,
  isUSDC,
  loanIsActive,
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMax = () => {
    setAmount(formatUnits(maxWithdrawable, token.decimals));
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Client-side validation (though disable button handles most)
    const amountBigInt = parseUnits(amount, token.decimals);
    if (amountBigInt > maxWithdrawable) {
      setError(`Amount exceeds withdrawable limit`);
      return;
    }

    try {
      await onWithdraw(amount, token.decimals);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Withdraw failed");
    }
  };

  const isInputValid =
    amount !== "" &&
    parseFloat(amount) > 0 &&
    parseUnits(amount, token.decimals) <= maxWithdrawable;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#141414] border border-cyan-500/15 rounded-lg p-6 w-full max-w-md relative mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A3A3A3] hover:text-white transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2
          className="text-xl font-normal text-white mb-6"
          style={{ fontFamily: "Space Grotesk" }}>
          Withdraw {token.symbol}
        </h2>

        {/* Balance Info */}
        <div className="bg-[#1E1E1E] rounded-md p-4 mb-6 border border-cyan-500/5">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-[#A3A3A3]">Wallet Balance:</span>
            <span className="text-sm text-white">
              {formatUnits(balance, token.decimals)} {token.symbol}
            </span>
          </div>
          {isUSDC && loanIsActive && (
            <div className="flex justify-between text-xs">
              <span className="text-cyan-400/80">Withdrawable Limit:</span>
              <span className="text-cyan-400">
                {formatUnits(maxWithdrawable, token.decimals)} {token.symbol}
              </span>
            </div>
          )}
        </div>

        {/* Use same input style as DepositForm or others */}
        <div className="space-y-2 mb-6">
          <label className="text-sm text-[#A3A3A3]">Amount</label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d*$/.test(val) || val === "") {
                  setAmount(val);
                  setError("");
                }
              }}
              placeholder="0.00"
              className="w-full bg-[#0A0A0A] border border-cyan-500/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#06b6d4] transition-colors pr-20"
              style={{ fontFamily: "Space Grotesk" }}
            />
            <button
              onClick={handleMax}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#06b6d4] font-bold px-2 py-1 rounded bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 transition-colors uppercase tracking-wider">
              MAX
            </button>
          </div>
          {error && <div className="text-xs text-red-500">{error}</div>}
        </div>

        <ActionButton
          onClick={handleWithdraw}
          disabled={!isInputValid || isWithdrawing}
          loading={isWithdrawing}
          variant="primary"
          className="w-full">
          Confirm Withdrawal
        </ActionButton>
      </div>
    </div>
  );
};
