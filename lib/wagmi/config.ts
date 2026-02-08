import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { createStorage } from "wagmi";

// Validate environment variables
const projectId = process.env.WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
  console.warn("WALLET_CONNECT_PROJECT_ID not found");
}

// Define Lisk Sepolia - our primary and only supported chain
export const liskSepolia = defineChain({
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia-api.lisk.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Lisk Sepolia Blockscout",
      url: "https://sepolia-blockscout.lisk.com",
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: "Invalend",
  projectId: projectId || "invalend-demo",
  chains: [liskSepolia],
  ssr: false,
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  // Add connection timeout and retry settings
  batch: {
    multicall: {
      batchSize: 1024,
      wait: 16,
    },
  },
});
