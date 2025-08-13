# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development
- `npm run dev` - Start development server (Next.js app on port 3000)
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run analyze` - Analyze bundle with @next/bundle-analyzer

### Testing and Quality
- `npm run test` - Run full test suite (prettier, lint, typecheck, jest)
- `npm run typecheck` - Check TypeScript types
- `npm run lint` - Run ESLint and stylelint
- `npm run jest` - Run Jest tests
- `npm run jest:watch` - Run Jest in watch mode
- `npm run prettier:check` - Check code formatting
- `npm run prettier:write` - Auto-format code

### Storybook
- `npm run storybook` - Start Storybook dev server on port 6006
- `npm run storybook:build` - Build production Storybook

## Architecture Overview

### Core Stack
- **Next.js 14** with App Router - React framework for production
- **Mantine v7** - UI component library
- **TypeScript** - Type safety throughout
- **Solana/Metaplex** - Blockchain integration for NFT/asset management

### Project Structure

#### `/app` - Next.js App Router pages
- `layout.tsx` - Root layout with providers and theme
- `page.tsx` - Landing page
- `/create` - Asset/collection creation UI
- `/explorer` - Asset/collection explorer with search
- `/collect` - Collection management
- `/autograph` - Autograph plugin demo
- `/oracle-demo` - Oracle integration demo

#### `/components` - React components
- Organized by feature (Create/, Explorer/, Autograph/, etc.)
- Each feature has its own directory with related components
- Shared components at root level

#### `/providers` - Context providers
- `Providers.tsx` - Main provider wrapper with wallet, query client, notifications
- `UmiProvider.tsx` - Metaplex Umi SDK setup
- `EnvProvider.tsx` - Environment configuration (mainnet/devnet/etc.)

#### `/lib` - Utility functions
- `plugin.ts` - Plugin management utilities for Metaplex Core
- `form.ts` - Form validation and transformation utilities
- `tx.ts` - Transaction handling utilities
- `string.ts` - String manipulation helpers

#### `/hooks` - Custom React hooks
- `asset.tsx` - Asset fetching and management hooks
- `fetch.ts` - Generic data fetching utilities

### Key Dependencies

#### Blockchain/Web3
- `@metaplex-foundation/mpl-core` - Core NFT protocol
- `@metaplex-foundation/umi` - Unified SDK for Solana
- `@solana/web3.js` - Solana JavaScript SDK
- `@solana/wallet-adapter-react` - Wallet connection

#### UI/UX
- `@mantine/*` - Component library modules
- `@tanstack/react-query` - Data fetching and caching
- `@tabler/icons-react` - Icon library

### Environment Configuration
The app supports multiple Solana networks configured via environment variables:
- `NEXT_PUBLIC_MAINNET_RPC_URL`
- `NEXT_PUBLIC_DEVNET_RPC_URL`
- `NEXT_PUBLIC_ECLIPSE_MAINNET_RPC_URL`
- `NEXT_PUBLIC_ECLIPSE_DEVNET_RPC_URL`
- `NEXT_PUBLIC_SONIC_DEVNET_RPC_URL`

Network selection is managed through URL query parameters (`?env=mainnet` or `?env=devnet`).

### Key Patterns

#### Umi Integration
The app uses Metaplex's Umi SDK for blockchain interactions. The UmiProvider sets up the connection with the appropriate plugins (mplCore, dasApi) and wallet adapter.

#### Plugin System
The Metaplex Core plugin system is extensively used for asset management. The `/lib/plugin.ts` file contains utilities for managing different plugin types (owner-managed, authority-managed, permanent).

#### Form Management
Complex forms (like asset creation) use React Context for state management with custom validation and transformation utilities.

#### Query Caching
React Query is used for data fetching with proper cache invalidation strategies for blockchain data.