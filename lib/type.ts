import { AssetV1, CollectionV1 } from '@metaplex-foundation/mpl-core';

export type AssetWithCollection = {
  asset: AssetV1
  collection?: CollectionV1
};

export type SeedInput =
| { type: 'Collection' }
| { type: 'Owner' }
| { type: 'Recipient' }
| { type: 'Asset' }
| {
  type: 'Address';
  pubkey: string;
}
| {
  type: 'Bytes';
  bytes: Uint8Array;
};

export type ExtraAccountWithNoneInput = { type: 'PreconfiguredProgram' }
| {
    type: 'PreconfiguredCollection';
  }
| { type: 'PreconfiguredOwner' }
| { type: 'PreconfiguredRecipient' }
| { type: 'PreconfiguredAsset' }
| {
    type: 'CustomPda';
    seeds: Array<SeedInput>;
  }
| {
    type: 'Address';
    address: string;
  }
  | {
    type: 'None';
  };
