import {
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconGauge, IconCoin, IconBolt } from '@tabler/icons-react';
import classes from './FeaturesCards.module.css';

const data = [
  {
    title: 'Lowest cost',
    description:
      'With creation costs as low as ◎0.0029, Core is the cheapest NFT standard on Solana.',
    icon: IconCoin,
  },
  {
    title: 'Extreme performance',
    description:
      "Optimize your dApps through Core's single account model and 90% reduction in Compute Units for lifecycle actions like mint and transfer.",
    icon: IconGauge,
  },
  {
    title: 'Maximum versatility',
    description:
      'Add custom functionlity to your Core assets with 1st and 3rd party plugins that hook into lifecycle events.',
    icon: IconBolt,
  },
];

export function FeaturesCards() {
  const theme = useMantineTheme();
  const features = data.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.mplxGreen[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" className={classes.wrapper}>
      {/* <Group justify="center">
        <Badge variant="filled" size="lg">
          Best company ever
        </Badge>
      </Group> */}

      <Title order={2} className={classes.title} ta="center" mt="sm">
        A standard purpose-built for Digital Assets
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Designed from the ground-up, Core is the culmination of learnings since introducing the first Solana NFT standard in early 2021. Core rethinks the concept of digital assets on Solana, optimizing for cost, extensibility and performance.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
