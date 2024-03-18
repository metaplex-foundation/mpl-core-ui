import { Card, Group, Image, Skeleton, Text } from '@mantine/core';
import { CollectionV1 } from 'core-preview';
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
                height={160}
              />
            </Skeleton>
          </Card.Section>
          <Group justify="space-between" mt="md">
            <Text fw={500}>{collection.name}</Text>
          </Group>

        </Card>
        {/* {collection?.metadata
          && <Badge
            variant="default"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '0.5rem',

            }}
          >#{collection.metadata.inscriptionRank.toString()!}
             </Badge>} */}
      </Skeleton>
    </RetainQueryLink>
  );
}
