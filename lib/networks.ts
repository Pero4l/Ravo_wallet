export type NetworkId = "sepolia" | "mainnet";

export interface Network {
  id: NetworkId;
  name: string;
  chainId: number;
  rpcUrl: string;
  currency: string;
  explorerUrl: string;
  icon?: string;
}

const SEPOLIA_RPC =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
  "https://eth-sepolia.blockpi.io/v1/rpc/public";

const MAINNET_RPC =
  process.env.NEXT_PUBLIC_MAINNET_RPC_URL ||
  "https://eth-mainnet.blockpi.io/v1/rpc/public";

export const NETWORKS: Record<NetworkId, Network> = {
  sepolia: {
    id: "sepolia",
    name: "Sepolia Testnet",
    chainId: 11155111,
    rpcUrl: SEPOLIA_RPC,
    currency: "ETH",
    explorerUrl: "https://sepolia.etherscan.io",
  },
  mainnet: {
    id: "mainnet",
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: MAINNET_RPC,
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
  },
};

export const DEFAULT_NETWORK = NETWORKS.sepolia;
