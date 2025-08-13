import { PluginAuthority } from '@metaplex-foundation/mpl-core';
import { ExplorerStat } from '../Explorer/ExplorerStat';

export interface AuthorityStatProps {
  authority: PluginAuthority;
  name: string;
}

export const AuthorityStat = ({ authority, name }: AuthorityStatProps) => {
  switch (authority.type) {
    case 'None':
    case 'Owner':
    case 'UpdateAuthority':
      return <ExplorerStat label={`${name} Authority`} value={authority.type} labeled />;
    case 'Address':
    default:
      return authority.address && <ExplorerStat label={`${name} Authority`} value={authority.address} copyable />;
  }
};
