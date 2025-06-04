# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AO Link is a web-based explorer and visualization tool for the AO protocol, built with React, TypeScript, and Vite. It provides an interface to explore processes, modules, messages, and other components of the AO ecosystem.

## Essential Commands

### Development
```bash
npm run dev          # Start development server on port 3005
npm run build        # Build for production
npm run check-types  # Run TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
```

### Deployment
```bash
npm run predeploy    # Clean dist directories and build
npm run deploy       # Deploy to Permaweb using permaweb-deploy
```

## Architecture Overview

### Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Material-UI (@mui), Tailwind CSS, Emotion
- **State Management**: Nanostores with persistent storage
- **Data Fetching**: URQL GraphQL client, Tanstack Query
- **AO Integration**: @permaweb/aoconnect for blockchain interaction

### Key Directories

- `/src/app/` - Page components organized by feature (processes, modules, messages, tokens, etc.)
- `/src/components/` - Reusable UI components including charts, tables, and common elements
- `/src/services/` - API services for GraphQL queries and AO protocol interactions
- `/src/stores/` - Nanostore state management for ARNS records and token info
- `/src/hooks/` - Custom React hooks for data fetching and state management
- `/src/utils/` - Utility functions for AO protocol, Arweave, formatting, and data processing

### Important Configuration

- **GraphQL Endpoint**: Configured in `/src/config/gateway.ts` - uses Goldsky for Arweave data
- **AO Connection**: Multiple CU (Compute Unit) connections configured in `/src/settings.ts`
- **Path Aliases**: `@/` maps to `/src/` directory

### Key Features Implementation

1. **Process Explorer**: Main views in `/src/app/entity/[slug]/` including ProcessPage, TokenBalances, and message tables
2. **Module System**: Module exploration in `/src/app/module/` and `/src/app/modules/`
3. **Message Tracking**: Message details and flows in `/src/app/message/[slug]/`
4. **Token Features**: Token pages with holder charts and transfer tracking
5. **ARNS Integration**: AR Name System support with dedicated pages and tables

### Development Notes

- The project uses Vite for fast development and building
- TypeScript strict mode is enabled
- ESLint is configured with Prettier integration
- Path aliases are configured for cleaner imports (@/ prefix)
- The app supports both dark and light themes
- Real-time data updates are implemented using React Query