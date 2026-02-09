"use client";

import { useState } from "react";
import { BorrowForm, RepayForm } from "@/components/pool/Loanform";
import { PoolStats } from "@/components/pool/PoolStats";
import { usePool } from "@/hooks/contracts/usePool";
import { useWithdraw } from "@/hooks/contracts/useWithdraw";
import { ActionButton } from "@/components/ui/TransactionButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatTokenAmount, formatCompactUSD, formatNumberWithCommas } from "@/lib/utils/formatters";

export const DashboardPage = () => {
  const { poolStats, userInfo, isLoading: isLoadingPool } = usePool();
  const { isWithdrawing, handleWithdraw, canWithdraw, tokenBalance } =
    useWithdraw();

  return (
    <div className="w-full space-y-8">
      {/* Welcome Section */}
      <div className="bg-[#141414] rounded-lg border border-cyan-500/15 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-4xl font-normal mb-2"
              style={{
                fontFamily: "Space Grotesk",
                letterSpacing: "-1px",
                lineHeight: "1.1",
                color: "#06b6d4",
              }}>
              Dashboard
            </h1>
            <p
              className="text-[#A3A3A3] text-lg"
              style={{
                fontFamily: "Space Grotesk",
                lineHeight: "1.6",
              }}>
              Monitor your positions, earnings, and protocol overview
            </p>
          </div>
          <div className="bg-[#06b6d4]/10 text-[#06b6d4] px-4 py-2 rounded-lg text-sm font-normal border border-[#06b6d4]/20">
            Beta
          </div>
        </div>

        {/* Protocol Stats - Shows overall protocol health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/15">
            <div className="flex items-center gap-1 mb-2">
              <span
                className="text-[#A3A3A3] text-sm"
                style={{ fontFamily: "Space Grotesk" }}>
                Total Value Locked
              </span>
              <span className="text-[#A3A3A3] cursor-help" title="Total assets deposited in the protocol">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div
              className="text-2xl font-normal mb-1"
              style={{
                fontFamily: "Space Grotesk",
                letterSpacing: "-0.5px",
                color: "#FFFFFF",
              }}>
              $2.4M
            </div>
            <div className="text-[#06b6d4] text-xs font-normal">
              +12.5% this month
            </div>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/15">
            <div className="flex items-center gap-1 mb-2">
              <span
                className="text-[#A3A3A3] text-sm"
                style={{ fontFamily: "Space Grotesk" }}>
                Active Loans
              </span>
              <span className="text-[#A3A3A3] cursor-help" title="Number of open borrowing positions">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div
              className="text-2xl font-normal mb-1"
              style={{
                fontFamily: "Space Grotesk",
                letterSpacing: "-0.5px",
                color: "#FFFFFF",
              }}>
              {formatNumberWithCommas(156)}
            </div>
            <div className="text-[#06b6d4] text-xs font-normal">
              8 new today
            </div>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/30">
            <div className="flex items-center gap-1 mb-2">
              <span
                className="text-[#A3A3A3] text-sm"
                style={{ fontFamily: "Space Grotesk" }}>
                Supply APY
              </span>
              <span className="text-[#A3A3A3] cursor-help" title="Annual percentage yield for lenders">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div
              className="text-2xl font-normal mb-1"
              style={{
                fontFamily: "Space Grotesk",
                letterSpacing: "-0.5px",
                color: "#06b6d4",
              }}>
              6.2%
            </div>
            <div className="text-[#06b6d4]/70 text-xs font-normal">
              Fixed rate
            </div>
          </div>
        </div>
      </div>

      {/* Pool Overview */}
      <div className="bg-[#141414] rounded-lg border border-cyan-500/15 p-8">
        <h2
          className="text-2xl font-normal mb-6 flex items-center gap-3"
          style={{
            fontFamily: "Space Grotesk",
            letterSpacing: "-0.5px",
            lineHeight: "1.2",
            color: "#06b6d4",
          }}>
          <div className="w-8 h-8 bg-[#06b6d4]/10 rounded-lg flex items-center justify-center border border-[#06b6d4]/20">
            <svg
              className="w-4 h-4 text-[#06b6d4]"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
            </svg>
          </div>
          Lending Pool Overview
        </h2>
        <PoolStats />
      </div>

      {/* Your Portfolio */}
      <div className="bg-[#141414] rounded-lg border border-cyan-500/15 p-8">
        <h2
          className="text-2xl font-normal mb-6 flex items-center gap-3"
          style={{
            fontFamily: "Space Grotesk",
            letterSpacing: "-0.5px",
            lineHeight: "1.2",
            color: "#06b6d4",
          }}>
          <div className="w-8 h-8 bg-[#06b6d4]/10 rounded-lg flex items-center justify-center border border-[#06b6d4]/20">
            <svg
              className="w-4 h-4 text-[#06b6d4]"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Your Portfolio
        </h2>

        {/* Portfolio Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lending Position */}
          <div className="space-y-6">
            <h3
              className="text-xl font-normal"
              style={{
                fontFamily: "Space Grotesk",
                letterSpacing: "-0.5px",
                color: "#FFFFFF",
              }}>
              Supply Position
            </h3>
            <p className="text-[#A3A3A3] text-xs mb-4" style={{ fontFamily: "Space Grotesk" }}>
              Your deposited assets earning yield
            </p>
            <div className="space-y-4">
              <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/15">
                <div
                  className="text-[#A3A3A3] text-sm mb-2"
                  style={{ fontFamily: "Space Grotesk" }}>
                  USDC Supplied
                </div>
                <div
                  className="text-xl font-normal mb-1"
                  style={{
                    fontFamily: "Space Grotesk",
                    letterSpacing: "-0.5px",
                    color: "#FFFFFF",
                  }}>
                  {isLoadingPool ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    userInfo?.shares || "0"
                  )}
                </div>
                <div className="text-[#A3A3A3] text-xs font-normal">
                  Your pool shares
                </div>
              </div>
              <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/15">
                <div
                  className="text-[#A3A3A3] text-sm mb-2"
                  style={{ fontFamily: "Space Grotesk" }}>
                  Asset Value
                </div>
                <div
                  className="text-xl font-normal mb-1"
                  style={{
                    fontFamily: "Space Grotesk",
                    letterSpacing: "-0.5px",
                    color: "#06b6d4",
                  }}>
                  {isLoadingPool ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    `$${userInfo?.assetValue || "0"}`
                  )}
                </div>
                <div className="text-[#A3A3A3] text-xs font-normal">
                  Including accrued yield
                </div>
              </div>
              <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/30">
                <div
                  className="text-[#A3A3A3] text-sm mb-2"
                  style={{ fontFamily: "Space Grotesk" }}>
                  Current APY
                </div>
                <div
                  className="text-xl font-normal mb-1"
                  style={{
                    fontFamily: "Space Grotesk",
                    letterSpacing: "-0.5px",
                    color: "#06b6d4",
                  }}>
                  {isLoadingPool ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    `${poolStats?.apy || "0"}%`
                  )}
                </div>
                <div className="text-[#06b6d4]/70 text-xs font-normal">
                  Earning rate
                </div>
              </div>

              {/* Withdraw Section */}
              {userInfo && parseFloat(userInfo.shares) > 0 && canWithdraw && (
                <div className="bg-[#0A0A0A] rounded-lg p-6 border border-cyan-500/15">
                  <h4
                    className="text-lg font-normal mb-4"
                    style={{
                      fontFamily: "Space Grotesk",
                      letterSpacing: "-0.5px",
                      color: "#FFFFFF",
                    }}>
                    Withdraw to Wallet
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-[#1E1E1E] rounded-lg p-4 border border-cyan-500/15">
                      <div
                        className="text-[#A3A3A3] text-sm mb-2"
                        style={{ fontFamily: "Space Grotesk" }}>
                        Available for Withdrawal
                      </div>
                      <div
                        className="text-lg font-normal"
                        style={{
                          fontFamily: "Space Grotesk",
                          letterSpacing: "-0.5px",
                          color: "#06b6d4",
                        }}>
                        {tokenBalance} USDC
                      </div>
                      <div
                        className="text-xs text-[#A3A3A3] font-normal mt-1"
                        style={{ fontFamily: "Space Grotesk" }}>
                        Ready to withdraw
                      </div>
                    </div>
                    <ActionButton
                      onClick={() =>
                        handleWithdraw(
                          "0x51BE083DB53C0BbD8c8Af1dca4b7A8F7C4b80b2C",
                          tokenBalance
                        )
                      }
                      disabled={
                        !canWithdraw ||
                        isWithdrawing ||
                        parseFloat(tokenBalance) <= 0
                      }
                      loading={isWithdrawing}
                      variant="secondary"
                      size="sm"
                      className="w-full">
                      {isWithdrawing ? "Withdrawing USDC..." : "Withdraw USDC"}
                    </ActionButton>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trading Position */}
          <div className="space-y-6">
            <h3
              className="text-xl font-normal"
              style={{
                fontFamily: "Space Grotesk",
                letterSpacing: "-0.5px",
                color: "#FFFFFF",
              }}>
              Borrow Position
            </h3>
            <p className="text-[#A3A3A3] text-xs mb-4" style={{ fontFamily: "Space Grotesk" }}>
              Your leveraged trading position
            </p>
            <div className="space-y-4">
              <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/15">
                <div
                  className="text-[#A3A3A3] text-sm mb-2"
                  style={{ fontFamily: "Space Grotesk" }}>
                  Borrowed
                </div>
                <div
                  className="text-xl font-normal mb-1"
                  style={{
                    fontFamily: "Space Grotesk",
                    letterSpacing: "-0.5px",
                    color: "#FFFFFF",
                  }}>
                  $12,500
                </div>
                <div className="text-[#A3A3A3] text-xs font-normal">
                  Outstanding debt
                </div>
              </div>
              <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/15">
                <div
                  className="text-[#A3A3A3] text-sm mb-2"
                  style={{ fontFamily: "Space Grotesk" }}>
                  Collateral
                </div>
                <div
                  className="text-xl font-normal mb-1"
                  style={{
                    fontFamily: "Space Grotesk",
                    letterSpacing: "-0.5px",
                    color: "#FFFFFF",
                  }}>
                  $2,500
                </div>
                <div className="text-[#A3A3A3] text-xs font-normal">
                  Securing your loan
                </div>
              </div>
              <div className="bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/30">
                <div
                  className="text-[#A3A3A3] text-sm mb-2"
                  style={{ fontFamily: "Space Grotesk" }}>
                  P&L
                </div>
                <div
                  className="text-xl font-normal mb-1"
                  style={{
                    fontFamily: "Space Grotesk",
                    letterSpacing: "-0.5px",
                    color: "#06b6d4",
                  }}>
                  +$387.00
                </div>
                <div className="text-[#06b6d4]/70 text-xs font-normal">
                  Unrealized profit
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoansPage = () => (
  <div className="space-y-8">
    <div className="space-y-6">
      <div className="bg-[#141414] rounded-lg border border-cyan-500/15 p-0 max-w-md mx-auto">
        <LoanTabSwitch />
      </div>
    </div>
  </div>
);

// Loan Tab Switch Component
const LoanTabSwitch = () => {
  const [activeTab, setActiveTab] = useState<"borrow" | "repay">("borrow");

  return (
    <>
      <div className="flex border-b border-cyan-500/15">
        <button
          className={`flex-1 py-4 text-center font-normal text-sm transition-colors rounded-tl-lg ${
            activeTab === "borrow"
              ? "text-[#06b6d4] border-b border-[#06b6d4] bg-[#1E1E1E]"
              : "text-[#A3A3A3] hover:text-white hover:bg-[#1E1E1E]"
          }`}
          onClick={() => setActiveTab("borrow")}
          style={{ fontFamily: "Space Grotesk" }}>
          Borrow
        </button>
        <button
          className={`flex-1 py-4 text-center font-normal text-sm transition-colors rounded-tr-lg ${
            activeTab === "repay"
              ? "text-[#06b6d4] border-b border-[#06b6d4] bg-[#1E1E1E]"
              : "text-[#A3A3A3] hover:text-white hover:bg-[#1E1E1E]"
          }`}
          onClick={() => setActiveTab("repay")}
          style={{ fontFamily: "Space Grotesk" }}>
          Repay
        </button>
      </div>
      <div className="p-8">
        {activeTab === "borrow" ? <BorrowForm /> : <RepayForm />}
      </div>
    </>
  );
};
