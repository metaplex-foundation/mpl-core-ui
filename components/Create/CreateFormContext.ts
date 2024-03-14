import { createFormContext } from '@mantine/form';

export interface AuthorityManagedPluginValues {
  royalties: {
    enabled: boolean;
    // authority: string;
    ruleSet: 'None' | 'AllowList' | 'DenyList';
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
    data: {
      [key: string]: string;
    }
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
    basisPoints: 500,
    creators: [],
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
    data: {},
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

export interface CreateFormValues {
  collection: 'None' | 'New' | 'Existing';
  name: string;
  uri: string;
  collectionName: string;
  collectionUri: string;
  collectionAddress: string;
  assetPlugins: AuthorityManagedPluginValues;
  collectionPlugins: AuthorityManagedPluginValues;
}

export const [CreateFormProvider, useCreateFormContext, useCreateForm] =
  createFormContext<CreateFormValues>();
