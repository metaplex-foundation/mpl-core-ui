import { createContext, useContext } from 'react';

export type Env = 'devnet' | 'mainnet' | 'localhost' | 'eclipse-devnet' | 'eclipse-mainnet' | 'sonic-devnet';
export type EnvOption = { env: Env, endpoint: string, label: string };

const endpoints: Record<Env, string | undefined> = {
  mainnet: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  devnet: process.env.NEXT_PUBLIC_DEVNET_RPC_URL,
  'eclipse-mainnet': process.env.NEXT_PUBLIC_ECLIPSE_MAINNET_RPC_URL,
  'eclipse-devnet': process.env.NEXT_PUBLIC_ECLIPSE_DEVNET_RPC_URL,
  'sonic-devnet': process.env.NEXT_PUBLIC_SONIC_DEVNET_RPC_URL,
  localhost: 'http://localhost:8899',
};

const labels: Record<Env, string> = {
  mainnet: 'Solana Mainnet',
  devnet: 'Solana Devnet',
  'eclipse-mainnet': 'Eclipse Mainnet',
  'eclipse-devnet': 'Eclipse Devnet',
  'sonic-devnet': 'Sonic Devnet',
  localhost: 'Localhost',
};

const envs: Env[] = Object
  .entries(endpoints)
  .map(([env, endpoint]) => endpoint ? env as Env : null)
  .filter(Boolean) as Env[];

export const envOptions: EnvOption[] = envs.map((env) => ({
  env,
  endpoint: endpoints[env] as string,
  label: labels[env] as string,
}));

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
