import { create } from 'zustand'

// ─── Types ───────────────────────────────────────────────────────────────────

export type TxStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error'

export interface LoanInfo {
  loanAmount: bigint        // 100% trade size (USDC, 6 dec)
  marginAmount: bigint      // 20% collateral deposited by trader
  poolFunding: bigint       // 80% from LendingPool
  startTime: number         // unix timestamp
  restrictedWallet: string  // trading wallet address
  isActive: boolean
}

export interface PoolStats {
  availableLiquidity: bigint
  totalAllocated: bigint
  apy: bigint               // basis points (600 = 6%)
  totalShares: bigint
}

// ─── Store Shape ─────────────────────────────────────────────────────────────

interface TraderState {
  // On-chain data (populated by useProtocolData)
  usdcBalance: bigint
  hasActiveLoan: boolean
  activeLoan: LoanInfo | null
  poolStats: PoolStats | null
  restrictedWalletAddress: `0x${string}` | null

  // Transaction status per action
  approveTxStatus: TxStatus
  depositTxStatus: TxStatus
  tradeTxStatus: TxStatus
  repayTxStatus: TxStatus

  // Human-readable errors per action key
  errors: Record<string, string | null>

  // Actions
  setUsdcBalance: (v: bigint) => void
  setActiveLoan: (loan: LoanInfo | null) => void
  setHasActiveLoan: (v: boolean) => void
  setPoolStats: (stats: PoolStats) => void
  setRestrictedWallet: (addr: `0x${string}` | null) => void
  setTxStatus: (
    tx: 'approveTxStatus' | 'depositTxStatus' | 'tradeTxStatus' | 'repayTxStatus',
    status: TxStatus
  ) => void
  setError: (key: string, msg: string | null) => void
  reset: () => void
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  usdcBalance: BigInt(0),
  hasActiveLoan: false,
  activeLoan: null,
  poolStats: null,
  restrictedWalletAddress: null,
  approveTxStatus: 'idle' as TxStatus,
  depositTxStatus: 'idle' as TxStatus,
  tradeTxStatus: 'idle' as TxStatus,
  repayTxStatus: 'idle' as TxStatus,
  errors: {},
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTraderStore = create<TraderState>((set) => ({
  ...initialState,

  setUsdcBalance: (v) => set({ usdcBalance: v }),

  setActiveLoan: (loan) => set({
    activeLoan: loan,
    restrictedWalletAddress: loan?.restrictedWallet as `0x${string}` | null ?? null,
  }),

  setHasActiveLoan: (v) => set({ hasActiveLoan: v }),

  setPoolStats: (stats) => set({ poolStats: stats }),

  setRestrictedWallet: (addr) => set({ restrictedWalletAddress: addr }),

  setTxStatus: (tx, status) => set((s) => ({ ...s, [tx]: status })),

  setError: (key, msg) =>
    set((s) => ({ errors: { ...s.errors, [key]: msg } })),

  reset: () => set(initialState),
}))
