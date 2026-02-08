"use client";

import { usePoolWithdraw } from "@/hooks/contracts/usePoolWithdraw";
import { parseUSDC } from "@/lib/utils/formatters";
import { ActionButton } from "@/components/ui/TransactionButton";
import { StatusCard, StatusItem } from "@/components/ui/StatusCard";
import { AmountInput } from "@/components/ui/AmountInput";
import { TransactionNotification } from "@/components/ui/TransactionNotification";
import { useState } from "react";

/**
 * Withdraw Form for Lenders
 * Allows users to redeem their pool shares for USDC from the LendingPool
 */
export const WithdrawForm = () => {
  const {
    handleWithdraw,
    currentStep,
    isWithdrawing,
    isWithdrawSuccess,
    isWithdrawError,
    hasShares,
    userShares,
    userAssets,
    availableLiquidity,
    resetTransactionState,
    redeemHash,
  } = usePoolWithdraw();

  const [amount, setAmount] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [txError, setTxError] = useState<string>("");

  const amountRaw = parseUSDC(amount || "0");
  const sharesRaw = parseUSDC(userShares || "0");

  const isValidAmount = amountRaw > BigInt(0) && amountRaw <= sharesRaw;
  const isButtonDisabled =
    !isValidAmount || isWithdrawing || currentStep === "success";

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    if (validationError) {
      setValidationError("");
    }
    if (txError) {
      setTxError("");
    }
  };

  const handleWithdrawClick = async () => {
    if (!isValidAmount) return;

    try {
      setTxError("");
      await handleWithdraw(amount);
    } catch (err) {
      console.error("Withdraw error:", err);
      setTxError(err instanceof Error ? err.message : "Withdraw failed");
    }
  };

  const handleReset = () => {
    resetTransactionState();
    setAmount("");
    setTxError("");
  };

  return (
    <div className="bg-[#0A0A0A] rounded-lg p-6 border border-cyan-500/15">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3
            className="text-lg font-normal text-white mb-2"
            style={{
              fontFamily: "Space Grotesk",
              letterSpacing: "-0.5px",
              lineHeight: "1.2",
            }}>
            Withdraw USDC
          </h3>
          <p
            className="text-sm text-[#A3A3A3] font-normal"
            style={{ fontFamily: "Space Grotesk" }}>
            Redeem your pool shares for USDC including accrued yield
          </p>
        </div>

        {/* User Position Info */}
        {hasShares ? (
          <StatusCard
            title="Your Pool Position"
            className="border-green-500/20 bg-green-500/5">
            <StatusItem
              label="Pool Shares"
              value={`${userShares} Shares`}
              highlight={true}
            />
            <StatusItem
              label="Asset Value"
              value={`${userAssets} USDC`}
              highlight={true}
            />
            <StatusItem
              label="Available Liquidity"
              value={`${availableLiquidity} USDC`}
              highlight={false}
            />
          </StatusCard>
        ) : (
          <div className="bg-[#1E1E1E] rounded-lg p-6 text-center border border-cyan-500/15">
            <div className="text-[#A3A3A3] mb-2">
              <svg
                className="w-12 h-12 mx-auto mb-4 opacity-50"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h4
              className="text-lg font-normal text-white mb-2"
              style={{
                fontFamily: "Space Grotesk",
                letterSpacing: "-0.5px",
              }}>
              No Pool Shares
            </h4>
            <p
              className="text-sm text-[#A3A3A3] font-normal"
              style={{ fontFamily: "Space Grotesk" }}>
              Deposit USDC first to receive pool shares and start earning yield.
            </p>
          </div>
        )}

        {/* Amount Input */}
        {hasShares && (
          <div>
            <label
              className="block text-sm font-normal text-white mb-2"
              style={{ fontFamily: "Space Grotesk" }}>
              Shares to Redeem
            </label>
            <AmountInput
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              maxValue={parseUSDC(userShares)}
              maxLabel="Shares"
              error={validationError}
            />
            <div className="flex justify-between text-xs text-[#A3A3A3] mt-1">
              <span>Your Shares: {userShares}</span>
              <button
                onClick={() => setAmount(userShares)}
                className="text-[#06b6d4] hover:text-[#0891B2] transition-colors"
                style={{ fontFamily: "Space Grotesk" }}>
                Max
              </button>
            </div>
          </div>
        )}

        {/* Transaction Notifications */}
        {isWithdrawing && (
          <TransactionNotification
            hash={redeemHash}
            status="pending"
            message="Redeeming shares..."
            autoHide={false}
          />
        )}

        {isWithdrawSuccess && (
          <TransactionNotification
            hash={redeemHash}
            status="success"
            message="Withdrawal successful! Your USDC has been returned."
            onClose={handleReset}
          />
        )}

        {isWithdrawError && (
          <TransactionNotification
            status="error"
            message={txError || "Withdrawal failed"}
            onClose={handleReset}
          />
        )}

        {/* Action Button */}
        <ActionButton
          onClick={handleWithdrawClick}
          disabled={isButtonDisabled}
          loading={isWithdrawing}
          size="lg"
          className="w-full"
          variant={hasShares && isValidAmount ? "primary" : "secondary"}>
          {currentStep === "withdraw" && isWithdrawing
            ? "Withdrawing..."
            : currentStep === "success"
            ? "Withdrawal Successful!"
            : hasShares
            ? "Withdraw USDC"
            : "No Shares to Withdraw"}
        </ActionButton>

        {/* Info */}
        {hasShares && (
          <div
            className="text-xs text-[#A3A3A3] space-y-2 font-normal"
            style={{ fontFamily: "Space Grotesk" }}>
            <p>• Redeem shares to receive USDC plus accrued yield</p>
            <p>• Withdrawal subject to available pool liquidity</p>
            <p>• Your yield is calculated at current share value</p>
          </div>
        )}
      </div>
    </div>
  );
};
