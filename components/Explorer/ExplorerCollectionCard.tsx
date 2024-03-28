import { Card, Flex, Group, Image, Skeleton, Text, ThemeIcon } from '@mantine/core';
import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import { IconSnowflake } from '@tabler/icons-react';
import { useAssetJson } from '../../hooks/asset';

import classes from './ExplorerCard.module.css';
import RetainQueryLink from '../RetainQueryLink';

export function ExplorerCollectionCard({ collection }: { collection: CollectionV1 }) {
  const { error, isPending, data: json } = useAssetJson(collection);

  return (
    <RetainQueryLink
      href={`/explorer/collection/${collection.publicKey}`}
      style={{
        textDecoration: 'none',
      }}
    >
      <Skeleton
        visible={isPending}
        className={classes.cardContainer}
      >
        <Card shadow="sm" padding="lg" radius="md">
          <Card.Section>
            <Skeleton visible={!!error}>
              <Image
                src={json?.image}
                height={200}
              />
            </Skeleton>
          </Card.Section>
          <Group justify="space-between" mt="md">
            <Text fw={500}>{collection.name}</Text>
            <Flex>
              {(collection.permanentFreezeDelegate?.frozen || collection.freezeDelegate?.frozen)
                && (
                  <ThemeIcon>
                    <IconSnowflake />
                  </ThemeIcon>
                )}
            </Flex>
          </Group>

        </Card>

      </Skeleton>
    </RetainQueryLink>
  );
}
