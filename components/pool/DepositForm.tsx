"use client";

import { useEffect, useMemo } from "react";
import { useDeposit } from "@/hooks/contracts/useDeposit";
import { ApproveActionButton } from "@/components/ui/TransactionButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { formatUSDC, formatTokenAmount } from "@/lib/utils/formatters";

export const DepositForm = () => {
  const {
    amount,
    setAmount,
    error,
    setError,
    usdcBalance,
    expectedShares,
    userInfo,
    needsApproval,
    isValidAmount,
    currentStep,
    isApproving,
    isDepositing,
    handleApprove,
    handleDeposit,
    resetStates,
    isApproveSuccess,
    isDepositSuccess,
  } = useDeposit();

  useEffect(() => {
    if (isDepositSuccess) resetStates();
  }, [isDepositSuccess, resetStates]);

  useEffect(() => {
    if (error) setError("");
  }, [amount, error, setError]);

  const hasBalance = usdcBalance && usdcBalance > BigInt(0);

  const validationMessage = useMemo(() => {
    if (!amount) return "";
    const num = parseFloat(amount);
    if (num <= 0) return "Amount must be greater than 0";
    if (usdcBalance && num > parseFloat(formatUSDC(usdcBalance)))
      return "Insufficient balance";
    return "";
  }, [amount, usdcBalance]);

  const showExpectedShares = expectedShares && parseFloat(amount) > 0;

  const handleMax = () => {
    if (!hasBalance) return;
    setAmount(formatUSDC(usdcBalance));
  };

  return (
    <div className="bg-[#0A0A0A] rounded-lg p-8 border border-cyan-500/15">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3
            className="text-2xl font-normal text-white mb-3"
            style={{
              fontFamily: "Space Grotesk",
              letterSpacing: "-0.5px",
              lineHeight: "1.2",
            }}>
            Supply USDC
          </h3>
          <p
            className="text-lg text-[#A3A3A3]"
            style={{
              fontFamily: "Space Grotesk",
              lineHeight: "1.6",
            }}>
            Deposit USDC to earn 6% APY while providing liquidity for borrowers
          </p>
        </div>

        {/* Your Position */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 space-y-4">
          <InfoRow
            label="Wallet Balance"
            value={`${formatTokenAmount(usdcBalance || BigInt(0), 6, 2)} USDC`}
          />
          {userInfo && (
            <>
              <InfoRow
                label="Your Pool Shares"
                value={`${formatTokenAmount(userInfo[0], 6, 2)} Shares`}
              />
              <InfoRow
                label="Current Value"
                value={`${formatTokenAmount(userInfo[1], 6, 2)} USDC`}
              />
            </>
          )}
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <label
            className="block text-sm font-normal text-[#A3A3A3]"
            style={{ fontFamily: "Space Grotesk" }}>
            Amount to Supply
          </label>
          {showExpectedShares && (
            <p
              className="text-sm text-[#06b6d4] font-normal"
              style={{ fontFamily: "Space Grotesk" }}>
              You will receive: {formatTokenAmount(expectedShares, 6, 2)} pool shares
            </p>
          )}
          <div className="relative">
            <input
              type="text"
              value={amount}
              placeholder="0.00"
              disabled={isApproving || isDepositing}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d*$/.test(val) || val === "") setAmount(val);
              }}
              className="w-full bg-[#1E1E1E] border border-cyan-500/15 rounded-lg px-4 py-3 text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#06b6d4] disabled:opacity-50 transition-colors"
              style={{ fontFamily: "Space Grotesk" }}
            />
            <button
              type="button"
              onClick={handleMax}
              disabled={!hasBalance || isApproving || isDepositing}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#06b6d4] hover:text-[#06b6d4]/80 disabled:opacity-50 font-normal"
              style={{ fontFamily: "Space Grotesk" }}>
              MAX
            </button>
          </div>
          {validationMessage && (
            <p
              className="text-sm text-red-400 font-normal"
              style={{ fontFamily: "Space Grotesk" }}>
              {validationMessage}
            </p>
          )}
        </div>

        {/* Error */}
        {error && <ErrorDisplay error={error} onRetry={() => setError("")} />}

        {/* Transaction Feedback */}
        {(isApproving || isDepositing) && (
          <div className="bg-dark-gray rounded-lg p-4 flex items-center space-x-3">
            <LoadingSpinner size="sm" />
            <div>
              <p className="text-sm text-white font-medium">
                {isApproving ? "Approving USDC..." : "Supplying USDC..."}
              </p>
              <p className="text-xs text-gray-400">
                {isApproving
                  ? "Please confirm in your wallet"
                  : "Transaction pending..."}
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {currentStep === "deposit" && isApproveSuccess && !isApproving && (
          <SuccessBox
            message="Approval successful!"
            subtext="Now click Supply to complete your deposit."
          />
        )}
        {currentStep === "success" && isDepositSuccess && !isDepositing && (
          <SuccessBox message="Supply successful! Your USDC is now earning 6% APY." />
        )}

        {/* Action Button */}
        <ApproveActionButton
          needsApproval={needsApproval}
          isApproving={isApproving}
          isApproveSuccess={isApproveSuccess}
          onApprove={handleApprove}
          isExecuting={isDepositing}
          isExecuteSuccess={isDepositSuccess}
          onExecute={handleDeposit}
          approveLabel="Approve USDC"
          approvingLabel="Approving USDC..."
          executeLabel="Supply USDC"
          executingLabel="Supplying USDC..."
          successLabel="Supply Successful!"
          disabled={!isValidAmount}
          size="lg"
          className="w-full"
        />

        {/* Info */}
        <div
          className="text-xs text-[#A3A3A3] space-y-2 font-normal"
          style={{ fontFamily: "Space Grotesk" }}>
          <p>• Earn 6% fixed APY on your supplied USDC</p>
          <p>• Withdraw anytime with your accrued earnings</p>
          <p>• First time? Approve USDC spending before supplying</p>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span
      className="text-sm text-[#A3A3A3] font-normal"
      style={{ fontFamily: "Space Grotesk" }}>
      {label}
    </span>
    <span
      className="text-white font-normal"
      style={{ fontFamily: "Space Grotesk" }}>
      {value}
    </span>
  </div>
);

const SuccessBox = ({
  message,
  subtext,
}: {
  message: string;
  subtext?: string;
}) => (
  <div className="bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-lg p-4 space-y-1">
    <p
      className="text-sm text-[#06b6d4] font-normal"
      style={{ fontFamily: "Space Grotesk" }}>
      {message}
    </p>
    {subtext && (
      <p
        className="text-xs text-[#06b6d4]/70 font-normal"
        style={{ fontFamily: "Space Grotesk" }}>
        {subtext}
      </p>
    )}
  </div>
);
