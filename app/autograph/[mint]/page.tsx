'use client';

import { Center, Container, Loader, Text } from '@mantine/core';
import { AutographAsset } from '@/components/Autograph/AutographAsset';
import { useFetchAssetWithCollection } from '@/hooks/fetch';

export default function ExplorerPage({ params }: { params: { mint: string } }) {
    const { mint } = params;
    const { error, isPending, data } = useFetchAssetWithCollection(mint);
    const { asset, collection } = data || {};
    return (
        <Container size="xl" pb="xl">
            {isPending &&
                <Center h="20vh">
                    <Loader />
                </Center>
            }
            {error &&
                <Center h="20vh">
                    <Text>Asset does not exist</Text>
                </Center>}
            {asset && <AutographAsset asset={asset} collection={collection} />}
        </Container>
    );
}
