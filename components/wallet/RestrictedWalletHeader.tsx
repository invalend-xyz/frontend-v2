"use client";

import React from "react";

interface LoanStats {
  totalLoansCreated: bigint;
  totalLoansRepaid: bigint;
  activeLoans: bigint;
}

interface RestrictedWalletHeaderProps {
  withdrawLocked: boolean;
  loanStats: LoanStats | null;
}

export const RestrictedWalletHeader: React.FC<RestrictedWalletHeaderProps> = ({
  withdrawLocked,
  loanStats,
}) => {
  return (
    <div>
      <h1
        className="text-3xl font-normal text-white mb-2"
        style={{
          fontFamily: "Space Grotesk",
          letterSpacing: "-1px",
          lineHeight: "1.1",
        }}>
        Restricted Wallet
      </h1>
      <p
        className="text-[#A3A3A3] font-normal"
        style={{ fontFamily: "Space Grotesk" }}>
        View your restricted wallet balances and manage withdrawals once your
        loan is cleared.
      </p>
      {withdrawLocked ? (
        <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-600/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <p className="text-cyan-200 text-sm font-medium">
              Loan still active. Withdrawals are locked, but you can view your
              asset positions.
            </p>
          </div>
        </div>
      ) : (
        loanStats &&
        loanStats.totalLoansRepaid > 0 && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-400 text-sm font-medium">
                🎉 Congratulations! Your loan has been repaid. You can now
                withdraw your trading profits.
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};
