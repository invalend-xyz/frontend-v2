'use client'

/**
 * TraderPanel
 *
 * Unified end-to-end trader flow component for Invalend Protocol.
 * Implements the complete 20/80 prefunding mechanic:
 *
 *   Step 1 — Approve USDC spending by LoanManager
 *   Step 2 — Deposit margin (20%) → pool prefunds the other 80%
 *             RestrictedWallet is created / re-used automatically
 *   Step 3 — Swap USDC → ETH or BTC inside the RestrictedWallet
 *   Step 4 — Close position: swap back (if needed) then repay loan
 *
 * MVP caveats shown inline:
 *  - Repayment only works if RestrictedWallet holds USDC (C3)
 *  - No real-time PnL (no oracle, C2)
 *  - Liquidation is time-based, 30 days (C2)
 *
 * Design: matches existing frontend-v2 dark theme (bg-[#0A0A0A], cyan accents,
 * Space Grotesk font). Uses existing UI atoms from components/ui/.
 */

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { formatUnits, maxUint256 } from 'viem'

import { useProtocolData } from '@/hooks/useProtocolData'
import { useTraderStore } from '@/store/traderStore'
import { parseContractError } from '@/lib/utils/parseContractError'

// Re-use existing hooks — they are already wired to the correct contracts
import { useCreateLoan, useRepayLoan } from '@/hooks/contracts/useLoan'
import { useTradingHooks } from '@/hooks/contracts/useTrading'
import { CONTRACT_CONFIGS } from '@/lib/contracts/addresses'
import { TOKENS } from '@/lib/trading/constants'

// ─── Constants ────────────────────────────────────────────────────────────────

const USDC_DECIMALS = 6

// ─── Component ───────────────────────────────────────────────────────────────

export function TraderPanel() {
  const { isConnected } = useAccount()

  // Sync all on-chain reads into the store
  useProtocolData()

  const {
    usdcBalance,
    hasActiveLoan,
    activeLoan,
    poolStats,
    approveTxStatus,
    depositTxStatus,
    tradeTxStatus,
    repayTxStatus,
    setTxStatus,
    setError,
    errors,
  } = useTraderStore()

  // ── Local UI state ──────────────────────────────────────────────────────
  const [marginInput, setMarginInput] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<'ETH' | 'BTC'>('ETH')

  // ── Contract hooks ──────────────────────────────────────────────────────
  const {
    handleApprove,
    handleCreateLoan,
    needsApproval,
    isValidAmount,
    isApproving,
    isCreatingLoan,
    setAmount: setLoanAmount,
    validationError,
  } = useCreateLoan()

  const { handleRepay, isRepaying, isRepaySuccess } = useRepayLoan()

  const { executeSwap, isPending: isSwapPending, isConfirming: isSwapConfirming } =
    useTradingHooks()

  // ── Derived values ──────────────────────────────────────────────────────
  const marginBigInt = marginInput
    ? BigInt(Math.floor(parseFloat(marginInput) * 10 ** USDC_DECIMALS))
    : BigInt(0)
  const buyingPower = marginBigInt * BigInt(5)

  const tokenOut = TOKENS[selectedAsset]

  // ── Handlers ───────────────────────────────────────────────────────────

  function handleMarginChange(val: string) {
    // Allow only numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(val) && val !== '') return
    setMarginInput(val)
    setLoanAmount(val)
  }

  async function handleDeposit() {
    setError('deposit', null)
    try {
      if (needsApproval) {
        setTxStatus('approveTxStatus', 'pending')
        await handleApprove()
        setTxStatus('approveTxStatus', 'success')
      }
      setTxStatus('depositTxStatus', 'pending')
      await handleCreateLoan()
      setTxStatus('depositTxStatus', 'success')
      setMarginInput('')
    } catch (e) {
      setTxStatus(needsApproval ? 'approveTxStatus' : 'depositTxStatus', 'error')
      setError('deposit', parseContractError(e))
    }
  }

  async function handleSwap() {
    if (!activeLoan) return
    setError('swap', null)
    try {
      setTxStatus('tradeTxStatus', 'pending')
      await executeSwap(
        TOKENS.USDC,
        tokenOut,
        formatUnits(activeLoan.loanAmount, USDC_DECIMALS),
        0.5 // 0.5% slippage
      )
      setTxStatus('tradeTxStatus', 'success')
    } catch (e) {
      setTxStatus('tradeTxStatus', 'error')
      setError('swap', parseContractError(e))
    }
  }

  async function handleRepayLoan() {
    setError('repay', null)
    try {
      setTxStatus('repayTxStatus', 'pending')
      await handleRepay()
      setTxStatus('repayTxStatus', 'success')
    } catch (e) {
      setTxStatus('repayTxStatus', 'error')
      setError('repay', parseContractError(e))
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────

  if (!isConnected) {
    return (
      <div className="bg-[#0A0A0A] rounded-lg p-6 border border-cyan-500/15 flex flex-col items-center gap-4">
        <p className="text-[#A3A3A3] text-sm" style={{ fontFamily: 'Space Grotesk' }}>
          Connect your wallet to start trading.
        </p>
        <ConnectButton />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Pool Stats Bar ──────────────────────────────────────────── */}
      {poolStats && (
        <div className="bg-[#0A0A0A] rounded-lg px-5 py-3 border border-cyan-500/15 flex flex-wrap gap-x-8 gap-y-1 text-sm" style={{ fontFamily: 'Space Grotesk' }}>
          <span className="text-[#A3A3A3]">
            Pool available:{' '}
            <span className="text-white font-medium">
              {formatUnits(poolStats.availableLiquidity, USDC_DECIMALS)} USDC
            </span>
          </span>
          <span className="text-[#A3A3A3]">
            APY:{' '}
            <span className="text-cyan-400 font-medium">
              {Number(poolStats.apy) / 100}%
            </span>
          </span>
          <span className="text-[#A3A3A3]">
            Your USDC:{' '}
            <span className="text-white font-medium">
              {parseFloat(formatUnits(usdcBalance, USDC_DECIMALS)).toFixed(2)}
            </span>
          </span>
        </div>
      )}

      {/* ── OPEN POSITION (no active loan) ──────────────────────────── */}
      {!hasActiveLoan && (
        <div className="bg-[#0A0A0A] rounded-lg p-6 border border-cyan-500/15 space-y-5">
          <div>
            <h3
              className="text-lg font-normal text-white mb-1"
              style={{ fontFamily: 'Space Grotesk', letterSpacing: '-0.5px' }}>
              Open Position
            </h3>
            <p className="text-sm text-[#A3A3A3]" style={{ fontFamily: 'Space Grotesk' }}>
              Deposit 20% margin → protocol prefunds 80% → 5× buying power.
            </p>
          </div>

          {/* Margin input */}
          <div className="space-y-1">
            <label className="text-xs text-[#A3A3A3]" style={{ fontFamily: 'Space Grotesk' }}>
              Margin amount (USDC)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={marginInput}
              onChange={(e) => handleMarginChange(e.target.value)}
              className="w-full bg-[#111] border border-cyan-500/20 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-cyan-500/60 transition-colors"
              style={{ fontFamily: 'Space Grotesk' }}
            />
            {validationError && (
              <p className="text-xs text-red-400" style={{ fontFamily: 'Space Grotesk' }}>
                {validationError}
              </p>
            )}
          </div>

          {/* Buying power display */}
          {marginBigInt > BigInt(0) && (
            <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-lg px-4 py-3 flex justify-between text-sm" style={{ fontFamily: 'Space Grotesk' }}>
              <span className="text-[#A3A3A3]">5× Buying power</span>
              <span className="text-cyan-400 font-medium">
                {parseFloat(formatUnits(buyingPower, USDC_DECIMALS)).toFixed(2)} USDC
              </span>
            </div>
          )}

          {/* Asset selector */}
          <div className="space-y-1">
            <label className="text-xs text-[#A3A3A3]" style={{ fontFamily: 'Space Grotesk' }}>
              Trade into
            </label>
            <div className="flex gap-2">
              {(['ETH', 'BTC'] as const).map((asset) => (
                <button
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedAsset === asset
                      ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                      : 'border-cyan-500/20 text-[#A3A3A3] hover:border-cyan-500/40'
                  }`}
                  style={{ fontFamily: 'Space Grotesk' }}>
                  {asset}
                </button>
              ))}
            </div>
          </div>

          {/* Deposit / Approve button */}
          <button
            onClick={handleDeposit}
            disabled={
              !marginInput ||
              marginBigInt === BigInt(0) ||
              !isValidAmount ||
              isApproving ||
              isCreatingLoan ||
              approveTxStatus === 'pending' ||
              approveTxStatus === 'confirming' ||
              depositTxStatus === 'pending' ||
              depositTxStatus === 'confirming'
            }
            className="w-full py-3 rounded-lg bg-cyan-500 text-black font-semibold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={{ fontFamily: 'Space Grotesk' }}>
            {isApproving || approveTxStatus === 'confirming'
              ? 'Approving USDC...'
              : isCreatingLoan || depositTxStatus === 'confirming'
                ? 'Opening position...'
                : needsApproval
                  ? 'Approve USDC'
                  : 'Deposit & Open Position'}
          </button>

          {errors.deposit && (
            <p className="text-xs text-red-400" style={{ fontFamily: 'Space Grotesk' }}>
              {errors.deposit}
            </p>
          )}
        </div>
      )}

      {/* ── ACTIVE POSITION ─────────────────────────────────────────── */}
      {hasActiveLoan && activeLoan && (
        <div className="bg-[#0A0A0A] rounded-lg p-6 border border-cyan-500/15 space-y-5">
          <div className="flex items-center justify-between">
            <h3
              className="text-lg font-normal text-white"
              style={{ fontFamily: 'Space Grotesk', letterSpacing: '-0.5px' }}>
              Active Position
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" style={{ fontFamily: 'Space Grotesk' }}>
              OPEN
            </span>
          </div>

          {/* Position stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Your margin',
                value: `${parseFloat(formatUnits(activeLoan.marginAmount, USDC_DECIMALS)).toFixed(2)} USDC`,
              },
              {
                label: 'Pool funded',
                value: `${parseFloat(formatUnits(activeLoan.poolFunding, USDC_DECIMALS)).toFixed(2)} USDC`,
              },
              {
                label: 'Total trade size',
                value: `${parseFloat(formatUnits(activeLoan.loanAmount, USDC_DECIMALS)).toFixed(2)} USDC`,
                highlight: true,
              },
              {
                label: 'Opened',
                value: new Date(activeLoan.startTime * 1000).toLocaleString(),
              },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="bg-[#111] rounded-lg p-3 border border-cyan-500/10">
                <p className="text-xs text-[#A3A3A3] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                  {label}
                </p>
                <p
                  className={`text-sm font-medium ${highlight ? 'text-cyan-400' : 'text-white'}`}
                  style={{ fontFamily: 'Space Grotesk' }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Asset selector for swap */}
          <div className="space-y-1">
            <label className="text-xs text-[#A3A3A3]" style={{ fontFamily: 'Space Grotesk' }}>
              Swap USDC into
            </label>
            <div className="flex gap-2">
              {(['ETH', 'BTC'] as const).map((asset) => (
                <button
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedAsset === asset
                      ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                      : 'border-cyan-500/20 text-[#A3A3A3] hover:border-cyan-500/40'
                  }`}
                  style={{ fontFamily: 'Space Grotesk' }}>
                  {asset}
                </button>
              ))}
            </div>
          </div>

          {/* Trade actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSwap}
              disabled={isSwapPending || isSwapConfirming || tradeTxStatus === 'confirming'}
              className="flex-1 py-3 rounded-lg border border-cyan-500 text-cyan-400 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-500/10"
              style={{ fontFamily: 'Space Grotesk' }}>
              {isSwapPending || isSwapConfirming || tradeTxStatus === 'pending' || tradeTxStatus === 'confirming'
                ? `Swapping to ${selectedAsset}...`
                : `Swap to ${selectedAsset}`}
            </button>

            <button
              onClick={handleRepayLoan}
              disabled={isRepaying || repayTxStatus === 'pending' || repayTxStatus === 'confirming'}
              className="flex-1 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500/20"
              style={{ fontFamily: 'Space Grotesk' }}>
              {isRepaying || repayTxStatus === 'pending' || repayTxStatus === 'confirming'
                ? 'Closing...'
                : 'Close & Repay'}
            </button>
          </div>

          {/* MVP caveat */}
          <div className="text-xs text-[#6B6B6B] border-t border-cyan-500/10 pt-3" style={{ fontFamily: 'Space Grotesk' }}>
            ⚠ MVP: Repayment requires USDC in your trading wallet.
            If you swapped to {selectedAsset}, use the Trading page to swap back first.
          </div>

          {errors.swap && (
            <p className="text-xs text-red-400" style={{ fontFamily: 'Space Grotesk' }}>
              {errors.swap}
            </p>
          )}
          {errors.repay && (
            <p className="text-xs text-red-400" style={{ fontFamily: 'Space Grotesk' }}>
              {errors.repay}
            </p>
          )}
        </div>
      )}

      {/* ── SUCCESS STATE ─────────────────────────────────────────────── */}
      {isRepaySuccess && (
        <div className="bg-[#0A0A0A] rounded-lg p-5 border border-green-500/20 text-center space-y-2">
          <p className="text-green-400 font-medium text-sm" style={{ fontFamily: 'Space Grotesk' }}>
            Position closed successfully.
          </p>
          <p className="text-[#A3A3A3] text-xs" style={{ fontFamily: 'Space Grotesk' }}>
            Your USDC balance has been updated. You can open a new position above.
          </p>
        </div>
      )}
    </div>
  )
}
