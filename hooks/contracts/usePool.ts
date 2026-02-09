"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_CONFIGS } from "@/lib/contracts/addresses";
import { formatUSDC, formatUSDCDisplay, formatAPY } from "@/lib/utils/formatters";

export const usePool = () => {
  const { address } = useAccount();

  // Pool liquidity & stats
  const { data: availableLiquidity, isLoading: isLoadingLiquidity } =
    useReadContract({
      ...CONTRACT_CONFIGS.LENDING_POOL,
      functionName: "getAvailableLiquidity",
    });

  // Total Allocated (di luar pool, untuk loan)
  const { data: totalAllocated, isLoading: isLoadingAllocated } =
    useReadContract({
      ...CONTRACT_CONFIGS.LENDING_POOL,
      functionName: "totalAllocated",
    });

  // Pool APY constant
  const { data: apy, isLoading: isLoadingApy } = useReadContract({
    ...CONTRACT_CONFIGS.LENDING_POOL,
    functionName: "FIXED_APY",
  });

  // User-specific info (shares & asset value)
  const { data: userInfo, isLoading: isLoadingUser } = useReadContract({
    ...CONTRACT_CONFIGS.LENDING_POOL,
    functionName: "getUserInfo",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const formattedStats = {
    availableLiquidity: availableLiquidity
      ? formatUSDCDisplay(availableLiquidity as bigint)
      : "0",
    totalAllocated: totalAllocated ? formatUSDCDisplay(totalAllocated as bigint) : "0",
    apy: apy ? formatAPY(apy as bigint) : "0",
  };

  // User info - display formatted values with commas
  const formattedUserInfo = userInfo
    ? {
        shares: formatUSDCDisplay(userInfo[0] as bigint),
        assetValue: formatUSDCDisplay(userInfo[1] as bigint),
      }
    : null;

  return {
    poolStats: formattedStats,
    userInfo: formattedUserInfo,
    isLoading:
      isLoadingLiquidity || isLoadingAllocated || isLoadingApy || isLoadingUser,
  };
};
