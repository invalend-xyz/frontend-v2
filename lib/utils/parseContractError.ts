/**
 * Converts raw wagmi/viem errors into user-readable strings.
 * Maps known contract revert messages from LoanManager, LendingPool,
 * and RestrictedWallet to friendly copy.
 */
export function parseContractError(error: unknown): string {
  if (!error) return 'Unknown error'

  const raw =
    (error as { shortMessage?: string })?.shortMessage ??
    (error as { message?: string })?.message ??
    String(error)

  // User rejection (MetaMask / any wallet)
  if (/user rejected|user denied/i.test(raw)) return 'Transaction cancelled.'

  // Wrong chain
  if (/chain mismatch|wrong chain|switch.*network|chainid/i.test(raw))
    return 'Wrong network. Please switch to Base Sepolia.'

  // Insufficient native gas
  if (/insufficient funds for gas/i.test(raw))
    return 'Not enough ETH for gas fees.'

  // Generic insufficient balance
  if (/insufficient.*balance|balance.*insufficient/i.test(raw))
    return 'Insufficient balance.'

  // ── LoanManager revert strings ──────────────────────────────────────────

  if (raw.includes('Active loan exists'))
    return 'You already have an open position. Close it before opening a new one.'

  if (raw.includes('Insufficient margin'))
    return 'Collateral too low. You need at least 20% of the trade size.'

  if (raw.includes('Insufficient pool liquidity'))
    return 'The pool does not have enough liquidity right now. Try a smaller size.'

  if (raw.includes('No active loan'))
    return 'No open position found.'

  if (raw.includes('Loan amount must be greater than 0'))
    return 'Trade size must be greater than 0.'

  // ── LendingPool revert strings ──────────────────────────────────────────

  if (raw.includes('Insufficient pool liquidity'))
    return 'Pool liquidity is insufficient for this amount.'

  if (raw.includes('Amount must be greater than 0'))
    return 'Amount must be greater than zero.'

  if (raw.includes('Only loan manager'))
    return 'Unauthorized: only the protocol can call this.'

  // ── RestrictedWallet revert strings ────────────────────────────────────

  if (raw.includes('InsufficientUSDCForLoan'))
    return 'Cannot withdraw — USDC balance would fall below the loan repayment minimum.'

  if (raw.includes('TokenNotWhitelisted'))
    return 'This token is not supported for trading.'

  if (raw.includes('PoolDoesNotExist'))
    return 'No liquidity pool exists for this token pair.'

  if (raw.includes('TransactionExpired') || raw.includes('DeadlineTooLate'))
    return 'Transaction deadline expired. Please try again.'

  if (raw.includes('InsufficientOutput'))
    return 'Swap would receive less than the minimum amount. Increase slippage tolerance.'

  if (raw.includes('Unauthorized'))
    return 'You are not authorised to perform this action.'

  // ── Approval / ERC-20 ──────────────────────────────────────────────────

  if (raw.includes('ERC20InsufficientAllowance'))
    return 'Approval required. Please approve USDC spending first.'

  if (raw.includes('ERC20InsufficientBalance'))
    return 'Insufficient USDC balance.'

  // ── Generic fallback ───────────────────────────────────────────────────

  return `Transaction failed: ${raw.slice(0, 140)}`
}
