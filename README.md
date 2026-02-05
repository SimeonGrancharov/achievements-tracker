# Achievements Tracker

A mobile app for tracking personal achievements, built as a monorepo.

## Structure

```
apps/
  mobile/   - React Native (Expo) app
  server/   - Express API with Firebase Admin
packages/
  shared/   - Shared types and validation (Zod)
```

## Tech Stack

- **Mobile**: React Native, Expo, React Navigation, Redux Toolkit
- **Server**: Express, Firebase Admin, Zod, Vitest
- **Tooling**: TypeScript, pnpm workspaces

## Getting Started

```bash
pnpm install

# Mobile
cd apps/mobile
pnpm start

# Server
cd apps/server
pnpm dev
```
