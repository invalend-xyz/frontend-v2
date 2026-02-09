import { formatUnits, parseUnits } from "viem";

// Format USDC amount (6 decimals) - raw value without commas for calculations/inputs
export const formatUSDC = (
  amount: bigint | string | number,
  decimals: number = 6
): string => {
  try {
    const bigIntAmount =
      typeof amount === "string" ? BigInt(amount) : BigInt(amount);
    return formatUnits(bigIntAmount, decimals);
  } catch {
    return "0";
  }
};

// Format USDC for display with commas (e.g., "1,500.00")
export const formatUSDCDisplay = (
  amount: bigint | string | number,
  decimals: number = 6
): string => {
  try {
    const bigIntAmount =
      typeof amount === "string" ? BigInt(amount) : BigInt(amount);
    const formatted = formatUnits(bigIntAmount, decimals);
    const num = parseFloat(formatted);
    
    if (num >= 1000) {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return num.toFixed(2);
  } catch {
    return "0";
  }
};

// Parse USDC amount to bigint
export const parseUSDC = (amount: string, decimals: number = 6): bigint => {
  try {
    return parseUnits(amount, decimals);
  } catch {
    return BigInt(0);
  }
};

// Format address (shortened)
export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format percentage
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `${value.toFixed(decimals)}%`;
};

// Format APY from basis points
export const formatAPY = (basisPoints: bigint | string | number): string => {
  try {
    const bp =
      typeof basisPoints === "string"
        ? BigInt(basisPoints)
        : BigInt(basisPoints);
    const percentage = Number(bp) / 100; // Convert basis points to percentage
    return formatPercentage(percentage);
  } catch {
    return "0%";
  }
};

// Format time remaining
export const formatTimeRemaining = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// Format date from timestamp
export const formatDate = (timestamp: bigint | number | string): string => {
  try {
    const ts =
      typeof timestamp === "bigint" ? Number(timestamp) : Number(timestamp);
    if (ts === 0) return "-";
    const date = new Date(ts * 1000);
    return date.toLocaleString();
  } catch {
    return "-";
  }
};

// Format relative time
export const formatRelativeTime = (
  timestamp: bigint | number | string
): string => {
  try {
    const ts =
      typeof timestamp === "bigint" ? Number(timestamp) : Number(timestamp);
    if (ts === 0) return "-";
    const now = Date.now();
    const time = ts * 1000;
    const diff = now - time;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  } catch {
    return "-";
  }
};

// Format number with commas (1,500,020)
export const formatNumberWithCommas = (
  value: number | string | bigint
): string => {
  try {
    const num = typeof value === "bigint" ? Number(value) : Number(value);
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-US");
  } catch {
    return "0";
  }
};

// Format compact number (1.5M, 2.4K, etc.)
export const formatCompactNumber = (
  value: number | string | bigint
): string => {
  try {
    const num = typeof value === "bigint" ? Number(value) : Number(value);
    if (isNaN(num)) return "0";
    
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2).replace(/\.?0+$/, "")}K`;
    }
    return num.toFixed(2).replace(/\.?0+$/, "");
  } catch {
    return "0";
  }
};

// Format USD currency ($1,234.56)
export const formatUSD = (
  value: number | string | bigint,
  decimals: number = 2
): string => {
  try {
    const num = typeof value === "bigint" ? Number(value) : Number(value);
    if (isNaN(num)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return "$0.00";
  }
};

// Format compact USD ($1.5M, $2.4K)
export const formatCompactUSD = (value: number | string | bigint): string => {
  try {
    const num = typeof value === "bigint" ? Number(value) : Number(value);
    if (isNaN(num)) return "$0";
    
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")}B`;
    }
    if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
    }
    if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(2).replace(/\.?0+$/, "")}K`;
    }
    return `$${num.toFixed(2)}`;
  } catch {
    return "$0";
  }
};

// Format token amount with proper decimals
export const formatTokenAmount = (
  amount: bigint | string | number,
  decimals: number = 6,
  displayDecimals: number = 2
): string => {
  try {
    const bigIntAmount =
      typeof amount === "string" ? BigInt(amount) : BigInt(amount);
    const formatted = formatUnits(bigIntAmount, decimals);
    const num = parseFloat(formatted);
    
    // For very small numbers, show more decimals
    if (num > 0 && num < 0.01) {
      return num.toFixed(6).replace(/\.?0+$/, "");
    }
    // For larger numbers, use commas
    if (num >= 1000) {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: displayDecimals,
      });
    }
    return num.toFixed(displayDecimals);
  } catch {
    return "0";
  }
};
