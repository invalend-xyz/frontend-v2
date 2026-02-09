import {
  useCreateLoan,
  useUserLoanInfo,
  useRepayLoan,
} from "@/hooks/contracts/useLoan";
import { formatTokenAmount, formatRelativeTime } from "@/lib/utils/formatters";
import { ApproveActionButton, ActionButton } from "@/components/ui/TransactionButton";
import { StatusCard, StatusItem } from "@/components/ui/StatusCard";
import { AmountInput } from "@/components/ui/AmountInput";
import { TransactionNotification } from "@/components/ui/TransactionNotification";
import { ExplorerLink } from "@/components/ui/ExplorerLink";

export const BorrowForm = () => {
  const {
    amount,
    setAmount,
    validationError,
    requiredCollateral,
    poolFunding,
    needsApproval,
    isValidAmount,
    currentStep,
    isApproving,
    isCreatingLoan,
    approvalTx,
    loanTx,
    usdcBalance,
    handleApprove,
    handleCreateLoan,
    resetTransactionStates,
  } = useCreateLoan();

  const { loanInfo, refetch: refetchLoanInfo } = useUserLoanInfo();

  const isButtonDisabled = !isValidAmount || isApproving || isCreatingLoan;

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    if (validationError) {
      // Clear error when user starts typing
      resetTransactionStates();
    }
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
            Borrow USDC
          </h3>
          <p
            className="text-sm text-[#A3A3A3] font-normal"
            style={{ fontFamily: "Space Grotesk" }}>
            Open a leveraged position by depositing collateral to borrow USDC
          </p>
        </div>

        {/* Current Loan Status */}
        {loanInfo && (
          <StatusCard
            title="Active Loan"
            status={loanInfo.isActive ? "active" : "inactive"}>
            <StatusItem
              label="Amount Borrowed"
              value={`${formatTokenAmount(loanInfo.loanAmount)} USDC`}
              highlight={loanInfo.isActive}
            />
            <StatusItem
              label="Your Collateral"
              value={`${formatTokenAmount(loanInfo.marginAmount)} USDC`}
            />
            <StatusItem
              label="Pool Contribution"
              value={`${formatTokenAmount(loanInfo.poolFunding)} USDC`}
            />
            <StatusItem
              label="Started"
              value={formatRelativeTime(loanInfo.startTime)}
            />
            {loanInfo.restrictedWallet && (
              <StatusItem
                label="Trading Wallet"
                value={
                  <ExplorerLink
                    address={loanInfo.restrictedWallet}
                    showIcon={false}>
                    {loanInfo.restrictedWallet.slice(0, 8)}...
                  </ExplorerLink>
                }
              />
            )}
          </StatusCard>
        )}

        {/* Amount Input */}
        <AmountInput
          value={amount}
          onChange={handleAmountChange}
          label="Amount to Borrow"
          maxValue={usdcBalance}
          maxLabel="Wallet Balance"
          disabled={isApproving || isCreatingLoan}
          error={validationError}
        />

        {/* Loan Requirements */}
        {(requiredCollateral || poolFunding) && (
          <div className="bg-dark-gray rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              What You&apos;ll Need
            </h4>
            {requiredCollateral && (
              <StatusItem
                label="Collateral Required"
                value={`${formatTokenAmount(requiredCollateral)} USDC`}
                highlight
              />
            )}
            {poolFunding && (
              <StatusItem
                label="Leverage from Pool"
                value={`${formatTokenAmount(poolFunding)} USDC`}
              />
            )}
          </div>
        )}

        {/* Transaction Notifications */}
        {approvalTx.status === "pending" && (
          <TransactionNotification
            hash={approvalTx.hash}
            status="pending"
            message="Approving USDC spending..."
            autoHide={false}
          />
        )}

        {approvalTx.status === "success" && (
          <TransactionNotification
            hash={approvalTx.hash}
            status="success"
            message="USDC approval successful!"
          />
        )}

        {approvalTx.status === "error" && (
          <TransactionNotification
            status="error"
            message={approvalTx.error || "Approval failed"}
            onClose={resetTransactionStates}
          />
        )}

        {loanTx.status === "pending" && (
          <TransactionNotification
            hash={loanTx.hash}
            status="pending"
            message="Creating loan..."
            autoHide={false}
          />
        )}

        {loanTx.status === "success" && (
          <TransactionNotification
            hash={loanTx.hash}
            status="success"
            message="Loan created successfully!"
            onClose={() => {
              resetTransactionStates();
              refetchLoanInfo();
            }}
          />
        )}

        {loanTx.status === "error" && (
          <TransactionNotification
            status="error"
            message={loanTx.error || "Loan creation failed"}
            onClose={resetTransactionStates}
          />
        )}

        {/* Action Button */}
        <ApproveActionButton
          needsApproval={needsApproval}
          isApproving={isApproving}
          isApproveSuccess={approvalTx.status === "success"}
          onApprove={handleApprove}
          isExecuting={isCreatingLoan}
          isExecuteSuccess={loanTx.status === "success"}
          onExecute={handleCreateLoan}
          approveLabel="Approve USDC"
          approvingLabel="Approving USDC..."
          executeLabel="Borrow USDC"
          executingLabel="Opening Position..."
          successLabel="Position Opened!"
          disabled={!isValidAmount || currentStep === "success"}
          size="lg"
          className="w-full"
        />
      </div>
    </div>
  );
};

// RepayForm
export const RepayForm = () => {
  const { loanInfo, refetch: refetchLoanInfo } = useUserLoanInfo();
  const {
    handleRepay,
    repayTx,
    currentStep,
    isRepaying,
    resetTransactionState,
  } = useRepayLoan();

  const activeLoan = loanInfo && loanInfo.loanAmount && loanInfo.isActive;

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
            Repay Loan
          </h3>
          <p
            className="text-sm text-[#A3A3A3] font-normal"
            style={{ fontFamily: "Space Grotesk" }}>
            Close your position and withdraw your collateral
          </p>
        </div>

        {/* Current Loan Status */}
        {loanInfo && (
          <StatusCard
            title="Outstanding Debt"
            status={loanInfo.isActive ? "active" : "inactive"}>
            <StatusItem
              label="Amount Owed"
              value={`${formatTokenAmount(loanInfo.loanAmount)} USDC`}
              highlight={loanInfo.isActive}
            />
            <StatusItem
              label="Your Collateral"
              value={`${formatTokenAmount(loanInfo.marginAmount)} USDC`}
            />
            <StatusItem
              label="Pool Contribution"
              value={`${formatTokenAmount(loanInfo.poolFunding)} USDC`}
            />
            <StatusItem
              label="Started"
              value={formatRelativeTime(loanInfo.startTime)}
            />
            {loanInfo.restrictedWallet && (
              <StatusItem
                label="Trading Wallet"
                value={
                  <ExplorerLink
                    address={loanInfo.restrictedWallet}
                    showIcon={false}>
                    {loanInfo.restrictedWallet.slice(0, 8)}...
                  </ExplorerLink>
                }
              />
            )}
          </StatusCard>
        )}

        {/* No Active Loan */}
        {!activeLoan && (
          <div className="bg-[#1E1E1E] rounded-lg p-6 text-center border border-cyan-500/15">
            <div className="text-[#A3A3A3] mb-2">
              <svg
                className="w-12 h-12 mx-auto mb-4 opacity-50"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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
              No Open Position
            </h4>
            <p
              className="text-sm text-[#A3A3A3] font-normal"
              style={{ fontFamily: "Space Grotesk" }}>
              You don&apos;t have any active loans to repay.
            </p>
          </div>
        )}

        {/* Transaction Notifications */}
        {repayTx.status === "pending" && (
          <TransactionNotification
            hash={repayTx.hash}
            status="pending"
            message="Closing position..."
            autoHide={false}
          />
        )}

        {repayTx.status === "success" && (
          <TransactionNotification
            hash={repayTx.hash}
            status="success"
            message="Position closed! Collateral returned to your wallet."
            onClose={() => {
              resetTransactionState();
              refetchLoanInfo();
            }}
          />
        )}

        {repayTx.status === "error" && (
          <TransactionNotification
            status="error"
            message={repayTx.error || "Repay failed"}
            onClose={resetTransactionState}
          />
        )}

        {/* Action Button */}
        <ActionButton
          onClick={handleRepay}
          disabled={!activeLoan || isRepaying || currentStep === "success"}
          loading={isRepaying}
          size="lg"
          className="w-full"
          variant={activeLoan ? "primary" : "secondary"}>
          {currentStep === "repay" && isRepaying
            ? "Closing Position..."
            : currentStep === "success"
            ? "Position Closed!"
            : activeLoan
            ? "Repay & Close Position"
            : "No Position to Close"}
        </ActionButton>
      </div>
    </div>
  );
};
