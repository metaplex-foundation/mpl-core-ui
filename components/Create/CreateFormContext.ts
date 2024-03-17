import { createFormContext } from '@mantine/form';
import { AuthorityManagedPluginValues } from '@/lib/form';

export interface CreateFormValues {
  collection: 'None' | 'New' | 'Existing';
  name: string;
  uri: string;
  owner: string;
  collectionName: string;
  collectionUri: string;
  collectionAddress: string;
  assetPlugins: AuthorityManagedPluginValues;
  collectionPlugins: AuthorityManagedPluginValues;
}

export const [CreateFormProvider, useCreateFormContext, useCreateForm] =
  createFormContext<CreateFormValues>();
