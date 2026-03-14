'use client'

/**
 * useProtocolData
 *
 * Reads all on-chain state needed by the TraderPanel and syncs it into
 * the Zustand traderStore. Call this once at the top of any page that
 * renders TraderPanel so all sub-components can read from the store
 * without prop-drilling.
 *
 * Refresh cadence:
 *  - USDC balance + loan info: every 5 s (active position updates)
 *  - Pool stats: every 10 s (slower-moving)
 */

import { useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_CONFIGS } from '@/lib/contracts/addresses'
import { useTraderStore, type LoanInfo } from '@/store/traderStore'

// Raw tuple from LoanManager.getLoanInfo()
type RawLoanInfo = readonly [
  bigint,  // loanAmount
  bigint,  // marginAmount
  bigint,  // poolFunding
  number,  // startTime
  string,  // restrictedWallet
  boolean, // isActive
]

// Raw tuple from LendingPool.getPoolStats()
type RawPoolStats = readonly [
  bigint,  // totalAssetsAmount
  bigint,  // totalAllocatedAmount
  bigint,  // availableLiquidity
  bigint,  // totalShares
  bigint,  // currentAPY
]

export function useProtocolData() {
  const { address } = useAccount()

  const {
    setUsdcBalance,
    setHasActiveLoan,
    setActiveLoan,
    setPoolStats,
    setRestrictedWallet,
  } = useTraderStore()

  // ── USDC balance ──────────────────────────────────────────────────────────
  const { data: usdcBalance } = useReadContract({
    ...CONTRACT_CONFIGS.MOCK_USDC,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5_000,
    },
  })

  // ── Active loan flag ──────────────────────────────────────────────────────
  const { data: hasLoan } = useReadContract({
    ...CONTRACT_CONFIGS.LOAN_MANAGER,
    functionName: 'hasActiveLoan',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5_000,
    },
  })

  // ── Loan info (enabled only when loan is active) ──────────────────────────
  const { data: rawLoanInfo } = useReadContract({
    ...CONTRACT_CONFIGS.LOAN_MANAGER,
    functionName: 'getLoanInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5_000,
    },
  })

  // ── Pool stats ────────────────────────────────────────────────────────────
  const { data: rawPoolStats } = useReadContract({
    ...CONTRACT_CONFIGS.LENDING_POOL,
    functionName: 'getPoolStats',
    query: {
      refetchInterval: 10_000,
    },
  })

  // ── Sync to store ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (usdcBalance !== undefined) setUsdcBalance(usdcBalance as bigint)
  }, [usdcBalance, setUsdcBalance])

  useEffect(() => {
    setHasActiveLoan(!!hasLoan)
  }, [hasLoan, setHasActiveLoan])

  useEffect(() => {
    if (!rawLoanInfo) {
      setActiveLoan(null)
      setRestrictedWallet(null)
      return
    }

    const raw = rawLoanInfo as unknown as RawLoanInfo
    const loan: LoanInfo = {
      loanAmount:       raw[0],
      marginAmount:     raw[1],
      poolFunding:      raw[2],
      startTime:        Number(raw[3]),
      restrictedWallet: raw[4] as string,
      isActive:         raw[5],
    }

    if (loan.isActive && loan.restrictedWallet !== '0x0000000000000000000000000000000000000000') {
      setActiveLoan(loan)
      setRestrictedWallet(loan.restrictedWallet as `0x${string}`)
    } else {
      setActiveLoan(null)
      setRestrictedWallet(null)
    }
  }, [rawLoanInfo, setActiveLoan, setRestrictedWallet])

  useEffect(() => {
    if (!rawPoolStats) return
    const raw = rawPoolStats as unknown as RawPoolStats
    setPoolStats({
      availableLiquidity: raw[2],
      totalAllocated:     raw[1],
      apy:                raw[4],
      totalShares:        raw[3],
    })
  }, [rawPoolStats, setPoolStats])
}
