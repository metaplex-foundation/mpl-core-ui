import { createContext, useContext } from 'react';

export type Env = 'devnet' | 'testnet' | 'mainnet' | 'localhost' | 'eclipse-devnet' | 'eclipse-mainnet' | 'eclipse-testnet' | 'sonic-devnet' | 'sonic-mainnet';

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
