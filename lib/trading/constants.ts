// Trading constants and token configurations for Base Sepolia network
import { CONTRACT_CONFIGS } from "@/lib/contracts/addresses";

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  price?: string;
  logo?: string;
  isNative?: boolean;
}

// Base Sepolia Token Addresses (imported from contracts.ts)
// Only deployed tokens: Mock USDC, Mock ETH, Mock BTC
export const TOKENS: Record<string, Token> = {
  USDC: {
    symbol: "USDC",
    name: "Mock USD Coin",
    address: CONTRACT_CONFIGS.MOCK_USDC.address,
    decimals: 6,
    price: "1.00",
  },
  ETH: {
    symbol: "ETH",
    name: "Mock Ethereum",
    address: CONTRACT_CONFIGS.MOCK_ETH.address,
    decimals: 18,
    price: "2,456.78",
  },
  BTC: {
    symbol: "BTC",
    name: "Mock Bitcoin",
    address: CONTRACT_CONFIGS.MOCK_BTC.address,
    decimals: 8,
    price: "111,210.45",
  },
};

// Default slippage options
export const SLIPPAGE_OPTIONS = ["0.1", "0.5", "1.0", "2.0"];

// Trading configuration
export const TRADING_CONFIG = {
  MAX_LEVERAGE: 5,
  MARGIN_REQUIREMENT: 0.2, // 20%
  DEFAULT_DEADLINE_MINUTES: 20,
  MIN_TRADE_AMOUNT: 1, // $1 USD minimum
  MAX_TRADE_AMOUNT: 100000, // $100k USD maximum
} as const;

// Transaction status types
export type TransactionStatus =
  | "idle"
  | "pending"
  | "confirming"
  | "success"
  | "error";

// Trade types
export type TradeType = "buy" | "sell";

// Swap types
export type SwapType = "exactInput" | "exactOutput";
