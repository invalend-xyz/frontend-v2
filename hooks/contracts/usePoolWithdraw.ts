"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACT_CONFIGS } from "@/lib/contracts/addresses";
import { parseUSDC, formatUSDC, formatUSDCDisplay } from "@/lib/utils/formatters";

/**
 * Hook for handling Lender withdrawals from the LendingPool
 * Uses ERC4626 redeem function to convert shares to USDC
 */
export const usePoolWithdraw = () => {
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState<
    "idle" | "withdraw" | "success"
  >("idle");

  // Get user's pool shares and asset value
  const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
    ...CONTRACT_CONFIGS.LENDING_POOL,
    functionName: "getUserInfo",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Extract shares and assets from userInfo
  const userShares = useMemo(() => {
    if (!userInfo) return BigInt(0);
    // userInfo returns [shares, assets]
    return Array.isArray(userInfo) ? userInfo[0] : BigInt(0);
  }, [userInfo]);

  const userAssets = useMemo(() => {
    if (!userInfo) return BigInt(0);
    // userInfo returns [shares, assets]
    return Array.isArray(userInfo) ? userInfo[1] : BigInt(0);
  }, [userInfo]);

  // Check if user has shares to withdraw
  const hasShares = userShares > BigInt(0);

  // Get pool available liquidity
  const { data: availableLiquidity } = useReadContract({
    ...CONTRACT_CONFIGS.LENDING_POOL,
    functionName: "getAvailableLiquidity",
    query: { enabled: !!address },
  });

  // Withdraw transaction
  const { writeContract: redeemShares, data: redeemHash } = useWriteContract();
  const {
    isLoading: isWithdrawing,
    isSuccess: isWithdrawSuccess,
    isError: isWithdrawError,
  } = useWaitForTransactionReceipt({ hash: redeemHash });

  // Update step on success
  useEffect(() => {
    if (isWithdrawSuccess) {
      setCurrentStep("success");
      refetchUserInfo();
    }
  }, [isWithdrawSuccess, refetchUserInfo]);

  // Reset on error
  useEffect(() => {
    if (isWithdrawError) {
      setCurrentStep("idle");
    }
  }, [isWithdrawError]);

  const handleWithdraw = useCallback(
    async (sharesAmount: string) => {
      if (!address || !hasShares) {
        throw new Error("Cannot withdraw: no shares available");
      }

      setCurrentStep("withdraw");

      try {
        const sharesWei = parseUSDC(sharesAmount);

        // Use redeem(shares, receiver, owner)
        await redeemShares({
          ...CONTRACT_CONFIGS.LENDING_POOL,
          functionName: "redeem",
          args: [sharesWei, address, address],
        });
      } catch (err: unknown) {
        console.error("Withdraw error:", err);
        setCurrentStep("idle");
        throw err;
      }
    },
    [redeemShares, address, hasShares]
  );

  const resetTransactionState = useCallback(() => {
    setCurrentStep("idle");
  }, []);

  return {
    handleWithdraw,
    currentStep,
    isWithdrawing,
    isWithdrawSuccess,
    isWithdrawError,
    hasShares,
    userShares: formatUSDC(userShares),
    userSharesDisplay: formatUSDCDisplay(userShares),
    userAssets: formatUSDC(userAssets),
    userAssetsDisplay: formatUSDCDisplay(userAssets),
    availableLiquidity: availableLiquidity
      ? formatUSDC(availableLiquidity)
      : "0",
    availableLiquidityDisplay: availableLiquidity
      ? formatUSDCDisplay(availableLiquidity)
      : "0",
    resetTransactionState,
    refetchUserInfo,
    redeemHash,
  };
};
