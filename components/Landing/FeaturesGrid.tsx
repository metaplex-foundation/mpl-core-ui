import { ThemeIcon, Text, Container, SimpleGrid, rem } from '@mantine/core';
import { IconLock, IconStack2, IconCode, IconConfetti, IconSitemap, IconLink } from '@tabler/icons-react';
import classes from './FeaturesGrid.module.css';

export const data = [
  {
    icon: IconStack2,
    title: 'First class collections',
    description:
      'Apply collection-wide configurations to collections in a single transaction, automatic collection size tracking and more.',
  },
  {
    icon: IconSitemap,
    title: 'Indexing included',
    description:
      'Choose your favorite Digital Asset Standard API provider (DAS API) to query Core assets and collections.',
  },
  {
    icon: IconLink,
    title: 'Configurable on-chain state',
    description:
      'Attach custom on-chain data to your assets via the attributes plugin which will automatically get indexed by the DAS API.',
  },
  {
    icon: IconCode,
    title: 'Developer friendly',
    description:
      "Comes with all the developer tooling and documentation you've come to expect from a Metaplex product as well as compatibility with top MPL projects such as Candy Machine, DAS API, Umi, Amman and more.",
  },
  {
    icon: IconConfetti,
    title: 'Ecosystem ready',
    description:
      'Join top Solana collections <redacted> and <redacted> in creating the next generation of Solana NFTs. Supported by top Solana wallets and marketplaces.',
  },
  {
    icon: IconLock,
    title: 'Secure by default',
    description:
      "Core has been audited by one of Solana's most trusted security firms, Mad Shield.",
  },
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </div>
  );
}

export function FeaturesGrid() {
  const features = data.map((feature, index) => <Feature {...feature} key={index} />);

  return (
    <Container className={classes.wrapper} size="lg">
      {/* <Title className={classes.title}>Integrate effortlessly with any technology stack</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when
          hunger drives it to try biting a Steel-type Pokémon.
        </Text>
      </Container> */}

      <SimpleGrid
        mt={60}
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: 'xl', md: 50 }}
        verticalSpacing={{ base: 'xl', md: 50 }}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}
