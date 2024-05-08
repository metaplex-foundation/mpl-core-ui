import {
  CheckResult,
  ExternalPluginInitInfoArgs,
  LifecycleChecks,
  Seed,
  ValidationResultsOffset,
} from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';
import { ExtraAccountWithNoneInput, SeedInput } from './type';

export interface OracleInput {
  lifecycles: ('Create' | 'Transfer' | 'Burn' | 'Update')[];
  offset: ValidationResultsOffset;
  baseAddress: string;
  pda: ExtraAccountWithNoneInput;
}

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
  };
  oracle: {
    enabled: boolean;
    oracles: OracleInput[];
  };
}

export const defaultAuthorityManagedPluginValues: AuthorityManagedPluginValues = {
  royalties: {
    enabled: false,
    ruleSet: 'None',
    programs: [],
    basisPoints: 500,
    creators: [
      {
        percentage: 100,
        address: '',
      },
    ],
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
    data: [
      {
        key: 'key',
        value: 'value',
      },
    ],
  },
  update: {
    enabled: false,
    authority: '',
  },
  permanentBurn: {
    enabled: false,
    authority: '',
  },
  oracle: {
    enabled: false,
    oracles: [
      {
        lifecycles: ['Transfer'],
        offset: {
          type: 'Anchor',
        },
        baseAddress: '',
        pda: {
          type: 'None',
        },
      },
    ],
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

export const createSeedFromInput = (input: SeedInput): Seed => {
  switch (input.type) {
    case 'Address':
      return {
        type: input.type,
        pubkey: publicKey(input.pubkey),
      };
    case 'Bytes':
      return {
        type: input.type,
        bytes: input.bytes,
      };
    default:
      return {
        type: input.type,
      };
  }
};

export const createExtraAccountFromInput = (input: ExtraAccountWithNoneInput) => {
  switch (input.type) {
    case 'None':
      return undefined;
    case 'Address':
      return {
        type: input.type,
        address: publicKey(input.address),
      };
    case 'CustomPda':
      return {
        type: input.type,
        seeds: input.seeds.map(createSeedFromInput),
      };
    default:
      return {
        type: input.type,
      };
  }
};

export const createOracleFromInput = (
  input: OracleInput
): Extract<ExternalPluginInitInfoArgs, { type: 'Oracle' }> => ({
    type: 'Oracle',
    baseAddress: publicKey(input.baseAddress),
    lifecycleChecks: input.lifecycles.reduce((acc, curr) => {
      acc[curr.toLowerCase() as keyof LifecycleChecks] = [CheckResult.CAN_REJECT];
      return acc;
    }, {} as LifecycleChecks),
    resultsOffset: input.offset,
    pda: createExtraAccountFromInput(input.pda),
  });
