import { AssetV1, CollectionV1 } from '@metaplex-foundation/mpl-core';

export type AssetWithCollection = {
  asset: AssetV1
  collection?: CollectionV1
};
