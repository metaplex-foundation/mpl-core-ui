import { Box, Text, Anchor } from '@mantine/core';

export function Footer() {
  return (
    <Box
      component="footer"
      style={{
        zIndex: 2,
        paddingTop: '4rem',
        paddingBottom: '1.5rem',
        textAlign: 'center',
        backgroundColor: '#141414',
      }}
    >
      <Text size="xs" c="dimmed">
        <Anchor href="https://www.metaplex.com/terms-and-conditions" target="_blank" c="dimmed">
          Terms & Conditions
        </Anchor>
        {' | '}
        <Anchor href="https://www.metaplex.com/privacy-policy" target="_blank" c="dimmed">
          Privacy Policy
        </Anchor>
      </Text>
    </Box>
  );
}
