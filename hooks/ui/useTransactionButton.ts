"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from "wagmi";

// ============================================================================
// TYPES
// ============================================================================

export type ButtonState =
  | "NOT_CONNECTED"
  | "WRONG_NETWORK"
  | "ENTER_AMOUNT"
  | "INSUFFICIENT_BALANCE"
  | "NEED_APPROVAL"
  | "APPROVING"
  | "APPROVAL_CONFIRMING"
  | "READY"
  | "EXECUTING"
  | "CONFIRMING"
  | "SUCCESS"
  | "ERROR";

export interface ButtonConfig {
  text: string;
  disabled: boolean;
  loading: boolean;
  variant: "primary" | "secondary";
}

export interface TransactionError {
  message: string;
  code?: string;
}

export interface UseTransactionButtonProps {
  /** Token address for balance/allowance checks */
  tokenAddress?: `0x${string}`;
  /** Spender address for allowance checks (contract that will spend tokens) */
  spenderAddress?: `0x${string}`;
  /** Amount in wei */
  amount?: bigint;
  /** Expected chain ID (Base Sepolia = 84532) */
  expectedChainId?: number;
  /** Whether approval step is required */
  requiresApproval?: boolean;
  /** Custom labels for different states */
  labels?: Partial<Record<ButtonState, string>>;
  /** Auto-reset after success (ms, default 3000, 0 to disable) */
  autoResetMs?: number;
}

// ERC20 ABI fragments for allowance and approve
const ERC20_ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// Default Base Sepolia chain ID
const DEFAULT_CHAIN_ID = 84532;

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useTransactionButton({
  tokenAddress,
  spenderAddress,
  amount,
  expectedChainId = DEFAULT_CHAIN_ID,
  requiresApproval = true,
  labels = {},
  autoResetMs = 3000,
}: UseTransactionButtonProps = {}) {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  
  const [error, setError] = useState<TransactionError | null>(null);
  const [manualState, setManualState] = useState<ButtonState | null>(null);

  // Check token balance using useReadContract
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!tokenAddress },
  });

  // Check allowance (only if approval required)
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && spenderAddress ? [address, spenderAddress] : undefined,
    query: {
      enabled: !!address && !!tokenAddress && !!spenderAddress && requiresApproval,
    },
  });

  // ============================================================================
  // WRITE CONTRACTS
  // ============================================================================

  // Approve transaction
  const {
    writeContract: approve,
    data: approveHash,
    isPending: isApprovePending,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  const {
    isLoading: isApproveConfirming,
    isSuccess: isApproveSuccess,
  } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Main transaction (execute)
  const {
    writeContract: execute,
    data: executeHash,
    isPending: isExecutePending,
    error: executeError,
    reset: resetExecute,
  } = useWriteContract();

  const {
    isLoading: isExecuteConfirming,
    isSuccess: isExecuteSuccess,
  } = useWaitForTransactionReceipt({
    hash: executeHash,
  });

  // ============================================================================
  // STATE DETERMINATION
  // ============================================================================

  const state = useMemo<ButtonState>(() => {
    // Manual override (for error/success handling)
    if (manualState) return manualState;

    // 1. Not connected
    if (!isConnected || !address) {
      return "NOT_CONNECTED";
    }

    // 2. Wrong network
    if (chain?.id !== expectedChainId) {
      return "WRONG_NETWORK";
    }

    // 3. No amount entered
    if (!amount || amount === BigInt(0)) {
      return "ENTER_AMOUNT";
    }

    // 4. Insufficient balance
    if (balance !== undefined && balance < amount) {
      return "INSUFFICIENT_BALANCE";
    }

    // 5. Approval flow
    if (requiresApproval && tokenAddress && spenderAddress) {
      if (isApprovePending) {
        return "APPROVING";
      }
      if (isApproveConfirming) {
        return "APPROVAL_CONFIRMING";
      }
      if (allowance !== undefined && allowance < amount) {
        return "NEED_APPROVAL";
      }
    }

    // 6. Execution flow
    if (isExecutePending) {
      return "EXECUTING";
    }
    if (isExecuteConfirming) {
      return "CONFIRMING";
    }
    if (isExecuteSuccess) {
      return "SUCCESS";
    }

    // 7. Error
    if (approveError || executeError) {
      return "ERROR";
    }

    // 8. Ready
    return "READY";
  }, [
    manualState,
    isConnected,
    address,
    chain,
    expectedChainId,
    amount,
    balance,
    requiresApproval,
    tokenAddress,
    spenderAddress,
    allowance,
    isApprovePending,
    isApproveConfirming,
    isExecutePending,
    isExecuteConfirming,
    isExecuteSuccess,
    approveError,
    executeError,
  ]);

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  useEffect(() => {
    if (approveError) {
      setError({ message: parseErrorMessage(approveError), code: approveError.name });
      setManualState("ERROR");
    }
  }, [approveError]);

  useEffect(() => {
    if (executeError) {
      setError({ message: parseErrorMessage(executeError), code: executeError.name });
      setManualState("ERROR");
    }
  }, [executeError]);

  // Auto-reset after success
  useEffect(() => {
    if (isExecuteSuccess && autoResetMs > 0) {
      const timer = setTimeout(() => {
        handleReset();
      }, autoResetMs);
      return () => clearTimeout(timer);
    }
  }, [isExecuteSuccess, autoResetMs]);

  // Refetch allowance after approve success
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleApprove = useCallback(() => {
    if (!tokenAddress || !spenderAddress || !amount) return;

    setError(null);
    setManualState(null);
    
    approve({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [spenderAddress, amount],
    });
  }, [tokenAddress, spenderAddress, amount, approve]);

  const handleExecute = useCallback(
    (
      contractAddress: `0x${string}`,
      abi: readonly unknown[],
      functionName: string,
      args: readonly unknown[]
    ) => {
      setError(null);
      setManualState(null);
      
      execute({
        address: contractAddress,
        abi: abi as any,
        functionName,
        args,
      });
    },
    [execute]
  );

  const handleSwitchNetwork = useCallback(() => {
    switchChain?.({ chainId: expectedChainId });
  }, [switchChain, expectedChainId]);

  const handleRetry = useCallback(() => {
    setError(null);
    setManualState(null);
    resetApprove();
    resetExecute();
  }, [resetApprove, resetExecute]);

  const handleReset = useCallback(() => {
    setError(null);
    setManualState(null);
    resetApprove();
    resetExecute();
    refetchBalance();
    refetchAllowance();
  }, [resetApprove, resetExecute, refetchBalance, refetchAllowance]);

  // ============================================================================
  // BUTTON CONFIG
  // ============================================================================

  const defaultLabels: Record<ButtonState, string> = {
    NOT_CONNECTED: "Connect Wallet",
    WRONG_NETWORK: "Switch Network",
    ENTER_AMOUNT: "Enter Amount",
    INSUFFICIENT_BALANCE: "Insufficient Balance",
    NEED_APPROVAL: "Approve",
    APPROVING: "Approving...",
    APPROVAL_CONFIRMING: "Confirming Approval...",
    READY: "Confirm",
    EXECUTING: "Processing...",
    CONFIRMING: "Confirming...",
    SUCCESS: "Success!",
    ERROR: "Try Again",
  };

  const buttonConfig = useMemo<ButtonConfig>(() => {
    const text = labels[state] || defaultLabels[state];

    const configs: Record<ButtonState, Omit<ButtonConfig, "text">> = {
      NOT_CONNECTED: { disabled: false, loading: false, variant: "primary" },
      WRONG_NETWORK: { disabled: false, loading: false, variant: "primary" },
      ENTER_AMOUNT: { disabled: true, loading: false, variant: "secondary" },
      INSUFFICIENT_BALANCE: { disabled: true, loading: false, variant: "secondary" },
      NEED_APPROVAL: { disabled: false, loading: false, variant: "primary" },
      APPROVING: { disabled: true, loading: true, variant: "primary" },
      APPROVAL_CONFIRMING: { disabled: true, loading: true, variant: "primary" },
      READY: { disabled: false, loading: false, variant: "primary" },
      EXECUTING: { disabled: true, loading: true, variant: "primary" },
      CONFIRMING: { disabled: true, loading: true, variant: "primary" },
      SUCCESS: { disabled: true, loading: false, variant: "primary" },
      ERROR: { disabled: false, loading: false, variant: "secondary" },
    };

    return { text, ...configs[state] };
  }, [state, labels]);

  // ============================================================================
  // COMPUTED FLAGS
  // ============================================================================

  const isLoading = ["APPROVING", "APPROVAL_CONFIRMING", "EXECUTING", "CONFIRMING"].includes(state);
  const isSuccess = state === "SUCCESS";
  const isError = state === "ERROR";
  const canProceed = state === "READY" || state === "NEED_APPROVAL";

  // Current step for multi-step flows
  const currentStep = useMemo(() => {
    if (["NEED_APPROVAL", "APPROVING", "APPROVAL_CONFIRMING"].includes(state)) {
      return 1;
    }
    if (["READY", "EXECUTING", "CONFIRMING", "SUCCESS"].includes(state)) {
      return requiresApproval ? 2 : 1;
    }
    return 0;
  }, [state, requiresApproval]);

  const totalSteps = requiresApproval ? 2 : 1;

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    state,
    buttonConfig,
    isLoading,
    isSuccess,
    isError,
    canProceed,

    // Multi-step
    currentStep,
    totalSteps,
    requiresApproval,

    // Data
    balance,
    allowance,
    error,
    approveHash,
    executeHash,

    // Actions
    handleApprove,
    handleExecute,
    handleSwitchNetwork,
    handleRetry,
    handleReset,
    refetchBalance,
    refetchAllowance,
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

function parseErrorMessage(error: Error | null): string {
  if (!error) return "Unknown error occurred";

  const message = error.message || error.toString();

  // Common Web3 error patterns
  if (message.toLowerCase().includes("user rejected") || 
      message.toLowerCase().includes("user denied")) {
    return "Transaction was rejected";
  }
  if (message.toLowerCase().includes("insufficient funds for gas")) {
    return "Insufficient funds for gas";
  }
  if (message.toLowerCase().includes("execution reverted")) {
    // Try to extract revert reason
    const match = message.match(/reason="([^"]+)"/);
    if (match) return match[1];
    return "Transaction failed";
  }
  if (message.toLowerCase().includes("nonce")) {
    return "Transaction nonce error - try again";
  }

  // Truncate long messages
  if (message.length > 100) {
    return message.slice(0, 100) + "...";
  }

  return message;
}
