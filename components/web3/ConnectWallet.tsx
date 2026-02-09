"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { CONTRACT_CONFIGS } from "@/lib/contracts/addresses";
import { formatUSDCDisplay } from "@/lib/utils/formatters";

export const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get USDC balance using balanceOf
  const {
    data: usdcBalance,
    refetch: refetchBalance,
    isFetching,
  } = useReadContract({
    ...CONTRACT_CONFIGS.MOCK_USDC,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
      refetchOnWindowFocus: true,
    },
  });

  // Refresh balance on any Transfer involving this address
  useWatchContractEvent({
    ...CONTRACT_CONFIGS.MOCK_USDC,
    eventName: "Transfer",
    enabled: !!address,
    onLogs: async (logs) => {
      const hit = logs.some((log) => {
        const { to, from } = log.args as {
          to?: `0x${string}`;
          from?: `0x${string}`;
        };
        const lower = address?.toLowerCase();
        return to?.toLowerCase() === lower || from?.toLowerCase() === lower;
      });
      if (hit) {
        setIsRefreshing(true);
        await refetchBalance();
        setIsRefreshing(false);
      }
    },
  });

  // Align manual flag with wagmi fetching state
  useEffect(() => {
    if (!isFetching && isRefreshing) {
      setIsRefreshing(false);
    }
  }, [isFetching, isRefreshing]);

  const showLoading = isRefreshing || isFetching;

  return (
    <div className="flex items-center gap-3">
      {isConnected && address && (
        <div className="bg-[#1E1E1E] px-3 py-1.5 rounded-lg border border-cyan-500/15">
          <span
            className="text-[#06b6d4] font-normal text-sm"
            style={{ fontFamily: "Space Grotesk" }}>
            {showLoading
              ? "Updating..."
              : `${formatUSDCDisplay(usdcBalance || BigInt(0))} USDC`}
          </span>
        </div>
      )}
      <ConnectButton showBalance={false} chainStatus="icon" />
    </div>
  );
};
