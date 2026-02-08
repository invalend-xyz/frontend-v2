"use client";

import { useState, useCallback } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import type { ButtonState, ButtonConfig } from "@/hooks/ui/useTransactionButton";
import { getTransactionUrl } from "@/lib/contracts/explorer";

// ============================================================================
// DESIGN TOKENS (from globals.css)
// ============================================================================

const COLORS = {
  accent: "#06b6d4",      // Primary gold
  accentHover: "#06b6d4", // Use same with opacity
  bgPrimary: "#0A0A0A",   // Dark background
  bgSecondary: "#141414", // Card background
  bgTertiary: "#1E1E1E",  // Input/hover background
  textPrimary: "#FFFFFF", // White text
  textSecondary: "#A3A3A3", // Gray text
  border: "rgba(6, 182, 212, 0.15)", // Gold border
  borderHover: "rgba(6, 182, 212, 0.3)",
};

// ============================================================================
// TYPES
// ============================================================================

export interface TransactionButtonProps {
  state: ButtonState;
  config: ButtonConfig;
  onAction: () => void;
  txHash?: `0x${string}`;
  error?: { message: string; code?: string } | null;
  currentStep?: number;
  totalSteps?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showSteps?: boolean;
}

// ============================================================================
// MAIN TRANSACTION BUTTON (Full state machine)
// ============================================================================

export function TransactionButton({
  state,
  config,
  onAction,
  txHash,
  error,
  currentStep = 0,
  totalSteps = 1,
  size = "lg",
  className = "",
  showSteps = true,
}: TransactionButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // All variants use project base colors
  const variantClasses = {
    primary: `bg-[${COLORS.accent}] text-[${COLORS.bgPrimary}] hover:opacity-90 focus:ring-[${COLORS.accent}]`,
    secondary: `bg-[${COLORS.bgTertiary}] text-white hover:bg-[#2E2E2E] focus:ring-[${COLORS.accent}] border border-[${COLORS.border}]`,
    warning: `bg-[${COLORS.accent}]/80 text-[${COLORS.bgPrimary}] hover:opacity-90 focus:ring-[${COLORS.accent}]`,
    danger: `bg-[${COLORS.bgTertiary}] text-[${COLORS.accent}] border border-[${COLORS.accent}]/50 focus:ring-[${COLORS.accent}]`,
    success: `bg-[${COLORS.accent}] text-[${COLORS.bgPrimary}] focus:ring-[${COLORS.accent}]`,
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

  return (
    <div className="space-y-3">
      {/* Step Indicator */}
      {showSteps && totalSteps > 1 && currentStep > 0 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i + 1 < currentStep
                    ? "bg-[#06b6d4] text-[#0A0A0A]"
                    : i + 1 === currentStep
                    ? "bg-[#06b6d4] text-[#0A0A0A]"
                    : "bg-[#1E1E1E] text-[#A3A3A3] border border-cyan-500/15"
                }`}
              >
                {i + 1 < currentStep ? "✓" : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    i + 1 < currentStep ? "bg-[#06b6d4]" : "bg-[#1E1E1E]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={onAction}
        disabled={config.disabled}
        className={`${baseClasses} ${variantClasses[config.variant]} ${sizeClasses[size]} ${className}`}
        style={{ fontFamily: "Space Grotesk" }}
        aria-busy={config.loading}
        aria-disabled={config.disabled}
      >
        {config.loading && <LoadingSpinner size="sm" className="mr-2" />}
        {config.text}
      </button>

      {/* Transaction Link */}
      {txHash && ["CONFIRMING", "SUCCESS"].includes(state) && (
        <div className="text-center">
          <a
            href={getTransactionUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#06b6d4] hover:text-[#06b6d4]/80 underline transition-colors"
            style={{ fontFamily: "Space Grotesk" }}
          >
            View on Explorer ↗
          </a>
        </div>
      )}

      {/* Error Display */}
      {error && state === "ERROR" && (
        <div className="bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-lg p-3">
          <p
            className="text-sm text-[#06b6d4] font-normal"
            style={{ fontFamily: "Space Grotesk" }}
          >
            {error.message}
          </p>
        </div>
      )}

      {/* Hints */}
      {["APPROVING", "EXECUTING"].includes(state) && (
        <p
          className="text-xs text-center text-[#A3A3A3]"
          style={{ fontFamily: "Space Grotesk" }}
        >
          Please confirm in your wallet...
        </p>
      )}

      {["APPROVAL_CONFIRMING", "CONFIRMING"].includes(state) && (
        <p
          className="text-xs text-center text-[#A3A3A3]"
          style={{ fontFamily: "Space Grotesk" }}
        >
          Waiting for confirmation...
        </p>
      )}
    </div>
  );
}

// ============================================================================
// SIMPLE TRANSACTION BUTTON
// ============================================================================

export function SimpleTransactionButton({
  state,
  config,
  onAction,
  size = "lg",
  className = "",
}: Pick<TransactionButtonProps, "state" | "config" | "onAction" | "size" | "className">) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary: "bg-[#06b6d4] text-[#0A0A0A] hover:opacity-90 focus:ring-[#06b6d4]",
    secondary: "bg-[#1E1E1E] text-white hover:bg-[#2E2E2E] focus:ring-[#06b6d4] border border-cyan-500/15",
    warning: "bg-[#06b6d4]/80 text-[#0A0A0A] hover:opacity-90 focus:ring-[#06b6d4]",
    danger: "bg-[#1E1E1E] text-[#06b6d4] border border-[#06b6d4]/50 focus:ring-[#06b6d4]",
    success: "bg-[#06b6d4] text-[#0A0A0A] focus:ring-[#06b6d4]",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed w-full transform active:scale-[0.98]";

  return (
    <button
      onClick={onAction}
      disabled={config.disabled}
      className={`${baseClasses} ${variantClasses[config.variant]} ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: "Space Grotesk" }}
      aria-busy={config.loading}
      aria-disabled={config.disabled}
    >
      {config.loading && <LoadingSpinner size="sm" className="mr-2" />}
      {config.text}
    </button>
  );
}

// ============================================================================
// ACTION BUTTON (Simple button with immediate disable on click)
// ============================================================================

export interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ActionButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "lg",
  className = "",
}: ActionButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary: "bg-[#06b6d4] text-[#0A0A0A] hover:opacity-90 focus:ring-[#06b6d4]",
    secondary: "bg-[#1E1E1E] text-white hover:bg-[#2E2E2E] focus:ring-[#06b6d4] border border-cyan-500/15",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

  const isDisabled = disabled || loading || isClicked;
  const isLoading = loading || isClicked;

  const handleClick = useCallback(async () => {
    if (isDisabled) return;
    
    // Immediately disable to prevent double-clicks
    setIsClicked(true);
    
    try {
      await onClick();
    } finally {
      // Re-enable after action completes (if not controlled by loading prop)
      if (!loading) {
        setIsClicked(false);
      }
    }
  }, [onClick, isDisabled, loading]);

  // Reset clicked state when loading changes to false
  if (!loading && isClicked) {
    // This will be handled by the useEffect below
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: "Space Grotesk" }}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}

// ============================================================================
// APPROVE ACTION BUTTON (Two-step approve → execute)
// ============================================================================

export type ApproveActionState =
  | "idle"
  | "approving"
  | "approved"
  | "executing"
  | "success";

export interface ApproveActionButtonProps {
  needsApproval: boolean;
  isApproving: boolean;
  isApproveSuccess: boolean;
  onApprove: () => Promise<void> | void;
  isExecuting: boolean;
  isExecuteSuccess: boolean;
  onExecute: () => Promise<void> | void;
  approveLabel?: string;
  approvingLabel?: string;
  executeLabel?: string;
  executingLabel?: string;
  successLabel?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ApproveActionButton({
  needsApproval,
  isApproving,
  isApproveSuccess,
  onApprove,
  isExecuting,
  isExecuteSuccess,
  onExecute,
  approveLabel = "Approve",
  approvingLabel = "Approving...",
  executeLabel = "Confirm",
  executingLabel = "Processing...",
  successLabel = "Success!",
  disabled = false,
  size = "lg",
  className = "",
}: ApproveActionButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  // Derive current state from props
  const currentState = (() => {
    if (isExecuteSuccess) return "success";
    if (isExecuting) return "executing";
    if (isApproveSuccess && needsApproval) return "approved";
    if (!needsApproval) return "approved";
    if (isApproving) return "approving";
    return "idle";
  })();

  // Determine button label
  const buttonLabel = (() => {
    switch (currentState) {
      case "approving":
        return approvingLabel;
      case "approved":
        return executeLabel;
      case "executing":
        return executingLabel;
      case "success":
        return successLabel;
      default:
        return approveLabel;
    }
  })();

  const isLoading = currentState === "approving" || currentState === "executing" || isClicked;
  const isButtonDisabled = disabled || isLoading || currentState === "success";

  const handleClick = useCallback(async () => {
    if (isButtonDisabled) return;

    // Immediately disable
    setIsClicked(true);

    try {
      if (currentState === "idle") {
        await onApprove();
      } else if (currentState === "approved") {
        await onExecute();
      }
    } finally {
      setIsClicked(false);
    }
  }, [currentState, onApprove, onExecute, isButtonDisabled]);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

  // Use accent color for all states
  const buttonClass = "bg-[#06b6d4] text-[#0A0A0A] hover:opacity-90 focus:ring-[#06b6d4]";

  return (
    <button
      onClick={handleClick}
      disabled={isButtonDisabled}
      className={`${baseClasses} ${buttonClass} ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: "Space Grotesk" }}
      aria-busy={isLoading}
      aria-disabled={isButtonDisabled}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {buttonLabel}
    </button>
  );
}

export default TransactionButton;
