import { ReactNode } from 'react';

import { Env, EnvContext } from './useEnv';

export const EnvProvider = ({
  env,
  children,
}: {
  env: Env
  children: ReactNode;
}) => <EnvContext.Provider value={{ env }}>{children}</EnvContext.Provider>;
