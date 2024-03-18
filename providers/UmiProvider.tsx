import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ReactNode, useMemo } from 'react';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { mplCore } from 'core-preview';
import { UmiContext } from './useUmi';

export const UmiProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  // let nftStorageToken = process.env.NFTSTORAGE_TOKEN;
  // if (!nftStorageToken || nftStorageToken === 'AddYourTokenHere'){
  //   console.error("Add your nft.storage Token to .env!");
  //   nftStorageToken = 'AddYourTokenHere';
  // }
  const umi = useMemo(() => createUmi(connection)
    .use(walletAdapterIdentity(wallet))
    .use(mplCore())
    .use(dasApi()), [wallet, connection]);

  return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>;
};
