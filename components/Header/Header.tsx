import { Center, Container, Flex, Group, Image, Menu } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import classes from './Header.module.css';
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
      bg="black"
    >
      <div className={classes.inner}>
        <Flex justify="center" align="center" gap="md" ml="md">
          <RetainQueryLink href="/">
            <Image src="/m-core-color.png" alt="Core" w="50%" />
          </RetainQueryLink>
        </Flex>
        <Group>
          <HeaderLink label="Create" link="/create" />
          <HeaderLink label="Explorer" link="/explorer" />
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
              <Menu.Item onClick={() => setEnv('mainnet')}>Mainnet</Menu.Item>
              <Menu.Item onClick={() => setEnv('devnet')}>Devnet</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Container>
  );
}
