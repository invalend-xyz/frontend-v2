"use client";

import React, { useState } from "react";
import { formatUnits } from "viem";
import { useRestrictedWallet } from "@/hooks/contracts/useRestrictedWallet";
import { TransactionNotification } from "@/components/ui/TransactionNotification";
import { formatUSDCDisplay } from "@/lib/utils/formatters";
import { COMMON_TOKENS } from "./tokens";
import { WalletHeader } from "./WalletHeader";
import { WalletStatCard } from "./WalletStatCard";
import { TokenListTable, TokenBalance } from "./TokenListTable";
import { WithdrawModal } from "./WithdrawModal";

export const RestrictedWalletPage: React.FC = () => {
  const {
    restrictedWalletAddress,
    hasRestrictedWallet,
    loanIsActive,
    withdrawToken,
    withdrawTx,
    isWithdrawing,
    resetTransactionState,
    useRestrictedWalletBalance,
    maxWithdrawableUSDC
  } = useRestrictedWallet();

  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch balances
  const usdcBalance = useRestrictedWalletBalance(COMMON_TOKENS[0].address);
  const ethBalance = useRestrictedWalletBalance(COMMON_TOKENS[1].address);
  const btcBalance = useRestrictedWalletBalance(COMMON_TOKENS[2].address);

  // Prepare token data
  const tokenBalances: TokenBalance[] = [
    {
      token: COMMON_TOKENS[0],
      balance: usdcBalance.data || BigInt(0),
      formatted: usdcBalance.data
        ? formatUnits(usdcBalance.data, COMMON_TOKENS[0].decimals)
        : "0",
    },
    {
      token: COMMON_TOKENS[1],
      balance: ethBalance.data || BigInt(0),
      formatted: ethBalance.data
        ? formatUnits(ethBalance.data, COMMON_TOKENS[1].decimals)
        : "0",
    },
    {
      token: COMMON_TOKENS[2],
      balance: btcBalance.data || BigInt(0),
      formatted: btcBalance.data
        ? formatUnits(btcBalance.data, COMMON_TOKENS[2].decimals)
        : "0",
    },
  ];

  const activeTokenCount = tokenBalances.filter(t => t.balance > BigInt(0)).length;
  const usdcToken = tokenBalances.find(t => t.token.symbol === "USDC");
  const currentUSDCBalance = usdcToken?.balance || BigInt(0);
  
  let withdrawableUSDC = currentUSDCBalance;
  if (loanIsActive) {
      withdrawableUSDC = maxWithdrawableUSDC < currentUSDCBalance ? maxWithdrawableUSDC : currentUSDCBalance;
  }

  const handleOpenWithdraw = (token: TokenBalance) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedToken(null);
  };

  const handleWithdrawSubmit = async (amount: string, decimals: number) => {
    if (!selectedToken) return;
    await withdrawToken(selectedToken.token.address, amount, decimals);
    // Modal closes automatically on success via transaction state if we want, OR simple close here?
    // User awaits tx hash in hook, but hook handles state. 
    // Wait, `withdrawToken` is async and returns promise? Yes.
    // So if it doesn't throw, we can close modal (transaction started).
    // The notification will handle pending/success/error.
    // But keeping modal open during pending might be better UX?
    // Plan: Modal closes immediately after *signing* (transition to pending), notification takes over.
    // Done in Modal component: `await onWithdraw... onClose()`.
  };

  if (!hasRestrictedWallet) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
         <h2 className="text-2xl font-normal text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>
           No Trading Wallet
         </h2>
         <p className="text-[#A3A3A3] font-normal" style={{ fontFamily: "Space Grotesk" }}>
           Open a borrow position first to create your trading wallet.
         </p>
      </div>
    );
  }

  // Calculate max withdrawable for the selected token
  let modalMaxWithdrawable = BigInt(0);
  if (selectedToken) {
      modalMaxWithdrawable = selectedToken.balance;
      // USDC logic
      if (selectedToken.token.symbol === "USDC" && loanIsActive) {
          if (maxWithdrawableUSDC < modalMaxWithdrawable) {
              modalMaxWithdrawable = maxWithdrawableUSDC;
          }
      }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <WalletHeader 
        address={restrictedWalletAddress!} 
        isActive={loanIsActive}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WalletStatCard
            label="Available to Withdraw"
            value={`${formatUSDCDisplay(withdrawableUSDC)} USDC`}
            subValue={loanIsActive ? "Collateral reserved" : "Full balance available"}
        />
        <WalletStatCard
            label="Tokens Held"
            value={activeTokenCount.toString()}
            subValue="Assets with balance"
        />
        <WalletStatCard
            label="Supported Assets"
            value={COMMON_TOKENS.length}
            subValue="Available for trading"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-normal text-white" style={{ fontFamily: "Space Grotesk" }}>
            Your Assets
        </h3>
        <TokenListTable
            tokens={tokenBalances}
            onOpenWithdraw={handleOpenWithdraw}
        />
      </div>

      {selectedToken && (
        <WithdrawModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            token={selectedToken.token}
            balance={selectedToken.balance}
            maxWithdrawable={modalMaxWithdrawable}
            isWithdrawing={isWithdrawing}
            onWithdraw={handleWithdrawSubmit}
            isUSDC={selectedToken.token.symbol === "USDC"}
            loanIsActive={loanIsActive}
        />
      )}

      {/* Notifications */}
      {withdrawTx.status !== "idle" && (
        <TransactionNotification
          status={withdrawTx.status}
          hash={withdrawTx.hash}
          message={
            withdrawTx.status === "success"
              ? "Tokens sent to your wallet"
              : withdrawTx.status === "pending"
              ? "Sending to wallet..."
              : withdrawTx.error || "Withdrawal failed"
          }
          onClose={resetTransactionState}
        />
      )}
    </div>
  );
};
