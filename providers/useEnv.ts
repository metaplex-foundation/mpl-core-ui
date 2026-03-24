import { createContext, useContext } from 'react';

export type Env = 'devnet' | 'testnet' | 'mainnet' | 'localhost' | 'eclipse-devnet' | 'eclipse-mainnet' | 'eclipse-testnet' | 'sonic-devnet' | 'sonic-mainnet';

export type EnvOption = {
  env: Env;
  label: string;
  endpoint: string | undefined;
};

const SOLANA_MAINNET_FALLBACK = 'https://api.mainnet-beta.solana.com';

const allEnvOptions: EnvOption[] = [
  { env: 'mainnet', label: 'Solana Mainnet', endpoint: process.env.NEXT_PUBLIC_MAINNET_RPC_URL ?? SOLANA_MAINNET_FALLBACK },
  { env: 'devnet', label: 'Solana Devnet', endpoint: process.env.NEXT_PUBLIC_DEVNET_RPC_URL },
  { env: 'eclipse-mainnet', label: 'Eclipse Mainnet', endpoint: process.env.NEXT_PUBLIC_ECLIPSE_MAINNET_RPC_URL },
  { env: 'eclipse-devnet', label: 'Eclipse Devnet', endpoint: process.env.NEXT_PUBLIC_ECLIPSE_DEVNET_RPC_URL },
  { env: 'eclipse-testnet', label: 'Eclipse Testnet', endpoint: process.env.NEXT_PUBLIC_ECLIPSE_TESTNET_RPC_URL },
  { env: 'sonic-mainnet', label: 'Sonic Mainnet', endpoint: process.env.NEXT_PUBLIC_SONIC_MAINNET_RPC_URL },
  { env: 'sonic-devnet', label: 'Sonic Devnet', endpoint: process.env.NEXT_PUBLIC_SONIC_DEVNET_RPC_URL },
  { env: 'localhost', label: 'Localhost', endpoint: 'http://localhost:8899' },
];

export function getEnvOptions(): EnvOption[] {
  return allEnvOptions.filter((o) => o.endpoint);
}

export function getEnvOption(env: Env): EnvOption | undefined {
  return getEnvOptions().find((o) => o.env === env);
}

type EnvContext = {
  env: Env;
};

const DEFAULT_CONTEXT: EnvContext = {
  env: 'devnet',
};

export const EnvContext = createContext<EnvContext>(DEFAULT_CONTEXT);

export function useEnv(): Env {
  const { env } = useContext(EnvContext);
  return env;
}
