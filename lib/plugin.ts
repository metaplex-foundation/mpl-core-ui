import { PublicKey, publicKey } from '@metaplex-foundation/umi';
import {
  AssetPluginKey,
  AssetV1,
  CollectionPluginsList,
  CollectionV1,
  CommonPluginsList,
  PluginType,
  hasAssetUpdateAuthority,
  hasCollectionUpdateAuthority,
} from '@metaplex-foundation/mpl-core';
import { capitalizeFirstLetter } from './string';

export type PluginKey = AssetPluginKey | keyof CollectionPluginsList;
export type PluginActions = {
  canAppove?: boolean;
  canRevoke?: boolean;
  canUpdate?: boolean;
  canAdd?: boolean;
  canRemove?: boolean;
};

export type PluginActionMap = Map<AssetPluginKey, PluginActions>;
export const ownerManagedPlugins: AssetPluginKey[] = [
  'transferDelegate',
  'freezeDelegate',
  'burnDelegate',
];

export const authorityManagedPlugins: (keyof CommonPluginsList)[] = [
  'royalties',
  'updateDelegate',
  'attributes',
  'addBlocker',
  'immutableMetadata',
];

export const permanentPlugins: (keyof CommonPluginsList)[] = [
  'permanentFreezeDelegate',
  'permanentTransferDelegate',
  'permanentBurnDelegate',
];

export const pluginTypes: AssetPluginKey[] = [
  ...ownerManagedPlugins,
  ...authorityManagedPlugins,
  ...permanentPlugins,
];

export function pluginTypeFromAssetPluginKey(key: PluginKey): PluginType {
  return PluginType[capitalizeFirstLetter(key) as keyof typeof PluginType];
}

export function pluginTypeNameFromPluginKey(key: PluginKey): keyof typeof PluginType {
  return capitalizeFirstLetter(key) as keyof typeof PluginType;
}

export function typeToLabel(type: PluginKey) {
  switch (type) {
    case 'transferDelegate':
      return 'Transfer';
    case 'freezeDelegate':
      return 'Freeze';
    case 'burnDelegate':
      return 'Burn';
    case 'royalties':
      return 'Royalties';
    case 'updateDelegate':
      return 'Update';
    case 'attributes':
      return 'Attributes';
    case 'permanentFreezeDelegate':
      return 'Permanent Freeze';
    case 'permanentTransferDelegate':
      return 'Permanent Transfer';
    case 'permanentBurnDelegate':
      return 'Permanent Burn';
    case 'edition':
      return 'Edition';
    case 'masterEdition':
      return 'Master Edition';
    case 'addBlocker':
      return 'Add Blocker';
    case 'immutableMetadata':
    default:
      return 'Immutable Metadata';
  }
}

export function getAssetPluginActions(
  identity: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
): PluginActionMap {
  const pubkey = publicKey(identity);
  const result = new Map<AssetPluginKey, PluginActions>();
  const isOwner = pubkey === asset.owner;
  const isUpdateAuth = hasAssetUpdateAuthority(identity, asset, collection);

  ownerManagedPlugins.forEach((type) => {
    const plugin = asset[type];
    if (plugin) {
      if (isOwner) {
        if (plugin.authority.type === 'Owner') {
          result.set(type, {
            canAppove: true,
            canRevoke: false,
            canUpdate: true,
            canRemove: true,
          });
        } else if (
          plugin.authority.type === 'Address' ||
          plugin.authority.type === 'UpdateAuthority'
        ) {
          result.set(type, {
            canAppove: false,
            // special case for frozen delegated assets - owners cannot revoke
            canRevoke: !(type === 'freezeDelegate' && asset.freezeDelegate?.frozen),
            canUpdate: false,
            canRemove: false,
          });
        }
      } else if (
        (plugin.authority.type === 'UpdateAuthority' && isUpdateAuth) ||
        (plugin.authority.type === 'Address' && plugin.authority.address === pubkey)
      ) {
        result.set(type, {
          canAppove: false,
          canRevoke: true,
          canUpdate: true,
          canRemove: false,
        });
      }
      // none means no authority to do anything
    } else if (isOwner) {
      result.set(type, {
        canAdd: true,
      });
    }
  });

  authorityManagedPlugins.forEach((type) => {
    const plugin = asset[type];
    if (plugin) {
      if (isUpdateAuth) {
        if (plugin.authority.type === 'UpdateAuthority') {
          result.set(type, {
            canAppove: true,
            canRevoke: false,
            canUpdate: true,
            canRemove: true,
          });
        } else if (plugin.authority.type === 'Owner' || plugin.authority.type === 'Address') {
          result.set(type, {
            canAppove: false,
            canRevoke: true,
            canUpdate: false,
            canRemove: false,
          });
        }
      } else if (
        (plugin.authority.type === 'Owner' && isOwner) ||
        (plugin.authority.type === 'Address' && plugin.authority.address === pubkey)
      ) {
        result.set(type, {
          canAppove: false,
          canRevoke: true,
          canUpdate: true,
          canRemove: false,
        });
      }
      // none means no authority to do anything
    } else if (isUpdateAuth) {
      result.set(type, {
        canAdd: true,
      });
    }
  });

  permanentPlugins.forEach((type) => {
    const plugin = asset[type];
    if (plugin) {
      if (plugin.authority.type === 'UpdateAuthority' && isUpdateAuth) {
        result.set(type, {
          canAppove: true,
          canUpdate: true,
          canRevoke: false,
          canRemove: true,
        });
      } else if (
        (plugin.authority.type === 'Owner' && isOwner) ||
        (plugin.authority.type === 'Address' && plugin.authority.address === pubkey)
      ) {
        result.set(type, {
          canAppove: false,
          canRevoke: true,
          canUpdate: true,
          canRemove: false,
        });
      }
    }
  });

  return result;
}

export function getCollectionPluginActions(
  identity: string | PublicKey,
  collection: CollectionV1
): PluginActionMap {
  const pubkey = publicKey(identity);
  const result = new Map<AssetPluginKey, PluginActions>();
  const isUpdateAuth = hasCollectionUpdateAuthority(identity, collection);

  authorityManagedPlugins.forEach((type) => {
    const plugin = collection[type];
    if (plugin) {
      if (isUpdateAuth) {
        if (plugin.authority.type === 'UpdateAuthority') {
          result.set(type, {
            canAppove: true,
            canRevoke: false,
            canUpdate: true,
            canRemove: true,
          });
        } else if (plugin.authority.type === 'Owner' || plugin.authority.type === 'Address') {
          result.set(type, {
            canAppove: false,
            canRevoke: true,
            canUpdate: false,
            canRemove: false,
          });
        }
      } else if (plugin.authority.type === 'Address' && plugin.authority.address === pubkey) {
        result.set(type, {
          canAppove: false,
          canRevoke: true,
          canUpdate: true,
          canRemove: false,
        });
      }
      // none means no authority to do anything
    } else if (isUpdateAuth) {
      result.set(type, {
        canAdd: true,
      });
    }
  });

  permanentPlugins.forEach((type) => {
    const plugin = collection[type];
    if (plugin) {
      if (plugin.authority.type === 'UpdateAuthority' && isUpdateAuth) {
        result.set(type, {
          canAppove: true,
          canUpdate: true,
          canRevoke: false,
          canRemove: true,
        });
      } else if (plugin.authority.type === 'Address' && plugin.authority.address === pubkey) {
        result.set(type, {
          canAppove: false,
          canRevoke: true,
          canUpdate: true,
          canRemove: false,
        });
      }
    }
  });

  return result;
}
