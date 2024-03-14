'use client';

import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, Box } from '@mantine/core';
import { IconNotes } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './Landing.module.css';
import RetainQueryLink from '../RetainQueryLink';

const links: { label: string; href: string }[] = [
  { label: 'MPL Repository', href: 'https://github.com/metaplex-foundation/mpl-core' },
  { label: 'Typedoc', href: 'https://mpl-core-js-docs.vercel.app/' },
  { label: 'Javascript SDK', href: 'https://github.com/metaplex-foundation/mpl-core/tree/main/clients/js' },
  { label: 'Rust SDK', href: 'https://github.com/metaplex-foundation/mpl-core/tree/main/clients/rust' },
];

export function Landing() {
  return (
    <>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Unleash the power of NFTs
            </Title>
            <Text c="dimmed" mt="md">
              The cheapest, most powerful Digital Asset standard on Solana, built on mpl-core.
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

            <Group mt={30}>
              <RetainQueryLink href="/create">
                <Button radius="xl" size="md" className={classes.control}>
                  Get started
                </Button>
              </RetainQueryLink>
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
          </div>
          <Image src="./hero.webp" className={classes.image} />
        </div>
      </Container>
      <Box bg="rgb(36, 36, 36)" py="xl">
        <Container size="md" py="xl" />
      </Box>
    </>
  );
}
