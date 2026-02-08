export type NetworkId = 'sepolia' | 'mainnet'

export interface Network {
  id: NetworkId
  name: string
  chainId: number
  rpcUrl: string
  currency: string
  icon?: string
}

export const NETWORKS: Record<NetworkId, Network> = {
  sepolia: {
    id: 'sepolia',
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/qEfTkffmk6tbZu65W8y6h',
    currency: 'ETH',
  },
  mainnet: {
    id: 'mainnet',
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/qEfTkffmk6tbZu65W8y6h',
    currency: 'ETH',
  },
}

export const DEFAULT_NETWORK = NETWORKS.sepolia
