import { AssetV1, CollectionV1 } from 'core-preview';

export type AssetWithCollection = {
  asset: AssetV1
  collection?: CollectionV1
};
