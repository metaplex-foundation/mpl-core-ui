import { Center, Container, Flex, Group, Menu, Title } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import classes from './Header.module.css';
import { MetaplexLogo, MetaplexLogoVariant } from '../MetaplexLogo';
import { Env } from '@/providers/useEnv';
import RetainQueryLink from '../RetainQueryLink';

const HeaderLink = ({ label, link, disabled }: { label: string, link: string, disabled?: boolean }) => {
  const cls = disabled ? [classes.disabled, classes.link].join(' ') : classes.link;
  return (
    <RetainQueryLink href={link} className={cls}>
      {label}
    </RetainQueryLink>
  );
};

export function Header({ env, setEnv }: { env: string; setEnv: (env: Env) => void }) {
  return (
    <Container
      size="xl"
      h={80}
      pt={12}
    >
      <div className={classes.inner}>
        <Flex justify="center" align="center" gap="md">
          <RetainQueryLink href="/">
            <MetaplexLogo variant={MetaplexLogoVariant.Small} />
          </RetainQueryLink>
          <Title order={2}>Core Assets</Title>
        </Flex>
        <Group>
          <HeaderLink label="Create" link="/create" />
          <HeaderLink label="Explorer" link="/explorer" />
          <HeaderLink label="Manage" link="/manage" />
          <WalletMultiButton />
          <Menu trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
            <Menu.Target>
              <a
                href={undefined}
                className={classes.link}
                onClick={(event) => event.preventDefault()}
              >
                <Center>
                  <span className={classes.linkLabel}>{env}</span>
                  <IconChevronDown size="0.9rem" stroke={1.5} />
                </Center>
              </a>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => setEnv('mainnet-beta')}>Mainnet Beta</Menu.Item>
              <Menu.Item onClick={() => setEnv('devnet')}>Devnet</Menu.Item>
              <Menu.Item onClick={() => setEnv('localhost')}>Localhost</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Container>
  );
}
