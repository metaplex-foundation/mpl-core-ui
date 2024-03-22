import { publicKey } from '@metaplex-foundation/umi';

export interface AuthorityManagedPluginValues {
  royalties: {
    enabled: boolean;
    // authority: string;
    ruleSet: 'None' | 'Allow list' | 'Deny list';
    programs: string[];
    basisPoints: number;
    creators: {
      percentage: number;
      address: string;
    }[];
  };
  soulbound: {
    enabled: boolean;
  };
  permanentFreeze: {
    enabled: boolean;
    authority: string;
    frozen: boolean;
  };
  permanentTransfer: {
    enabled: boolean;
    authority: string;
  };
  permanentBurn: {
    enabled: boolean;
    authority: string;
  };
  attributes: {
    enabled: boolean;
    // authority: string;
    data: { key: string; value: string }[];
  };
  update: {
    enabled: boolean;
    authority: string;
  }
}

export const defaultAuthorityManagedPluginValues: AuthorityManagedPluginValues = {
  royalties: {
    enabled: false,
    ruleSet: 'None',
    programs: [],
    basisPoints: 500,
    creators: [{
      percentage: 100,
      address: '',
    }],
  },
  soulbound: {
    enabled: false,
  },
  permanentFreeze: {
    enabled: false,
    authority: '',
    frozen: false,
  },
  permanentTransfer: {
    enabled: false,
    authority: '',
  },
  attributes: {
    enabled: false,
    data: [{
      key: 'key',
      value: 'value',
    }],
  },
  update: {
    enabled: false,
    authority: '',
  },
  permanentBurn: {
    enabled: false,
    authority: '',
  },
};

export const validatePubkey = (value: string) => {
  try {
    publicKey(value);
    return true;
  } catch {
    return false;
  }
};

export const validateUri = (value: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
};
