import { Flex, Paper, SimpleGrid, Text } from '@mantine/core';
import { AutographAssetDetails } from './AutographAssetDetails';
import { AssetWithCollection } from '@/lib/type';
import { AddAutographPlugin } from './AddAutographPlugin';
import { useUmi } from '@/providers/useUmi';
import { Sign } from './Sign';
import QRCode from './QRCode';

export function AutographAsset({ asset, collection }: AssetWithCollection) {
  const umi = useUmi();
  const isOwner = asset.owner === umi.identity.publicKey;
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} mt="xl" spacing="lg" pb="xl">
      <Paper p="xl" radius="md">
        <AutographAssetDetails asset={asset} collection={collection} />
      </Paper>

      <Flex gap="lg" direction="column">
        {isOwner && asset.autograph === undefined && <AddAutographPlugin asset={asset} />}
        {asset.autograph &&
          <Paper p="xl" radius="md">
            {asset.autograph.signatures.length > 0 && asset.autograph.signatures.map((sig, idx) =>
              <div>
                <Text fw={700} key={idx}>{`${sig.address}:`}</Text>
                <Text key={idx}>{`${sig.message}`}</Text>
              </div>
            )}
            {asset.autograph.signatures.length === 0 && <Text>No signatures yet</Text>}
          </Paper>
        }
        {!isOwner && asset.autograph && <Sign asset={asset} />}
        {isOwner && asset.autograph && <QRCode />}
      </Flex>
    </SimpleGrid>
  );
}
