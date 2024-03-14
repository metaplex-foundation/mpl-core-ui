import { Pda, PublicKey, Transaction, TransactionBuilder, TransactionBuilderGroup, Umi, signAllTransactions } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import pMap from 'p-map';

export const MAX_PERMITTED_DATA_INCREASE = 10_240;
export const signatureToString = (signature: Uint8Array) => base58.deserialize(signature)[0];

export interface SendTxsWithRetriesOptions {
  txs: Transaction[];
  umi: Umi;
  concurrency: number;
  retries?: number;
  commitment?: 'finalized' | 'confirmed';
  onProgress?: (signature: string) => void;
}

export async function sendTxsWithRetries({
  txs,
  umi,
  concurrency,
  onProgress,
  ...opts
}: SendTxsWithRetriesOptions) {
  const results: string[] = [];
  let retries = opts.retries || 3;
  let txsToSend = [...txs];
  const commitment = opts.commitment || 'confirmed';

  do {
    const errors: Transaction[] = [];
    console.log('init tries left', retries);
    // eslint-disable-next-line no-await-in-loop
    await pMap(
      txsToSend,
      async (tx) => {
        try {
          const blockhash = await umi.rpc.getLatestBlockhash({
            commitment,
          });
          const res = await umi.rpc.sendTransaction(tx, {
            commitment,
          });
          const sig = signatureToString(res);
          console.log('signature', sig);

          const confirmRes = await umi.rpc.confirmTransaction(res, {
              commitment,
              strategy: {
                type: 'blockhash',
                ...blockhash,
              },
            });
          if (confirmRes.value?.err) {
            throw new Error('Transaction failed');
          }

          onProgress?.(sig);
          results.push(sig);
        } catch (e) {
          console.log(e);
          errors.push(tx);
        }
      },
      {
        concurrency,
      }
    );
    txsToSend = errors;
    retries -= 1;
  } while (txsToSend.length && retries >= 0);

  return {
    signatures: results,
    errors: txsToSend,
  };
}

export interface BuildChunkedWriteDataOptions {
  umi: Umi;
  data: Uint8Array;
  chunkSize?: number;
  inscriptionAccount: Pda | PublicKey;
  inscriptionMetadataAccount: Pda | PublicKey;
  associatedTag: string | null;
  builder?: TransactionBuilder;
}

export interface BuildAllocateOptions {
  umi: Umi;
  currentSize?: number;
  targetSize: number;
  inscriptionAccount: Pda | PublicKey;
  inscriptionMetadataAccount: Pda | PublicKey;
  associatedTag: string | null;
  builder?: TransactionBuilder;
}

export interface PrepareAndSignTxsOptions {
  umi: Umi;
  builder: TransactionBuilder;
}

export async function prepareAndSignTxs({
  umi,
  builder,
}: PrepareAndSignTxsOptions) {
  const split = builder.unsafeSplitByTransactionSize(umi);
  const txs = (await new TransactionBuilderGroup(split).setLatestBlockhash(umi)).build(umi);

  const signedTxs = await signAllTransactions(txs.map((tx) => ({
    transaction: tx,
    signers: [umi.identity],
  })));

  return signedTxs;
}
