'use client';

import { Container, Title, Button, Group, Text, List, ThemeIcon, rem, Box, Flex, Stack, Alert } from '@mantine/core';
import { IconInfoCircle, IconNotes } from '@tabler/icons-react';
import Link from 'next/link';
import { CodeHighlight } from '@mantine/code-highlight';
import classes from './Landing.module.css';
import RetainQueryLink from '../RetainQueryLink';
import { FeaturesCards } from './FeaturesCards';
import { FeaturesGrid } from './FeaturesGrid';

const links: { label: string; href: string }[] = [
  { label: 'Documentation', href: 'https://developers.metaplex.com/core' },
  { label: 'MPL Repository', href: 'https://github.com/metaplex-foundation/mpl-core' },
  // { label: 'Typedoc', href: 'https://mpl-core-js-docs.vercel.app/' },
  { label: 'Javascript SDK', href: 'https://github.com/metaplex-foundation/mpl-core/tree/main/clients/js' },
  { label: 'Rust SDK', href: 'https://github.com/metaplex-foundation/mpl-core/tree/main/clients/rust' },
];

const code = `
const assetAddress = generateSigner(umi);
const asset = await createV1(umi, {
  asset: assetAddress,
  name: 'My digital asset #1',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi);

const recipient = generateSigner(umi);
await transferV1(umi, {
  asset: assetAddress.publicKey,
  newOwner: recipient.publicKey,
}).sendAndConfirm(umi);
`;

export function Landing() {
  return (
    <>
      <Alert variant="light" color="yellow" title="Core is now LIVE on mainnet!" icon={<IconInfoCircle />} />
      <div className={classes.heroSection}>
        <Container size="md" pb="xl">
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Start building with Core
              </Title>
              <Text c="dimmed" mt="md">
                Core is a next generation Solana NFT standard and asset program
              </Text>

              <List
                mt={30}
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={20} radius="xl">
                    <IconNotes style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </ThemeIcon>
                }
              >
                {links.map((link) => (
                  <List.Item key={link.href}>
                    {link.label} - <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >here
                                   </a>
                  </List.Item>
                ))}
              </List>

            </div>
            {/* <Image src="./hero.webp" className={classes.image} /> */}
          </div>
          <Group pb={60} mt="md">
            <RetainQueryLink href="/create">
              <Button radius="xl" size="md" className={classes.control}>
                Try it now
              </Button>
            </RetainQueryLink>
            <Link href="https://developers.metaplex.com/core">
              <Button variant="default" radius="xl" size="md" className={classes.control}>
                Documentation
              </Button>
            </Link>
            <Link href="https://github.com/metaplex-foundation/mpl-core">
              <Button variant="default" radius="xl" size="md" className={classes.control}>
                Source code
              </Button>
            </Link>
            <RetainQueryLink href="/explorer">
              <Button variant="outline" radius="xl" size="md" className={classes.control}>
                Explorer
              </Button>
            </RetainQueryLink>
          </Group>
        </Container>
      </div>
      <Box bg="rgb(12, 12, 12)" pb="xl" pt="md">
        <FeaturesCards />
        <Container size="md" py="xl" />
      </Box>
      <div style={{
        position: 'relative',
      }}
      >
        <Container className={classes.codeContainer} size="md">
          <Flex justify="space-between">
            <Stack p="lg" gap="md" justify="center">
              <Title order={2}>Single account, single program</Title>
              <Text>No more dealing with ATA&apos;s, metadata acounts, edition accounts or delegate accounts.</Text>
            </Stack>
            <CodeHighlight language="typescript" className={classes.code} code={code} />
          </Flex>
        </Container>
      </div>

      <FeaturesGrid />

    </>
  );
}
