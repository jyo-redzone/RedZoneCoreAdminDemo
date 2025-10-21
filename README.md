# Admin Mock

A responsive admin interface built with React, TypeScript, and Material-UI for managing hierarchical entities (Clubs → Sports → Teams → Users and Pitches → Cameras).

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI v6** - Component library
- **Zustand** - State management
- **Zod** - Schema validation
- **Vite** - Build tool and dev server
- **pnpm** - Package manager

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production

```bash
pnpm build
```

### 4. Preview Production Build

```bash
pnpm preview
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Project Structure

```
src/
├── app/                    # App root, theme, and routing
├── layout/                 # Responsive shells (Desktop, Tablet, Mobile)
├── features/admin/         # Admin-specific components, hooks, models, and store
│   ├── api/               # API layer and fixtures
│   ├── components/        # UI components
│   ├── hooks/             # Custom hooks
│   ├── model/             # Types and schemas
│   └── store/             # Zustand store
└── shared/                # Cross-feature UI + utilities
    ├── components/        # Reusable components
    ├── hooks/             # Shared hooks
    └── utils/             # Utility functions
```

## Features

- **Responsive Design**: Adapts to desktop, tablet, and mobile breakpoints
- **Hierarchical Navigation**: Tree-based navigation for entity relationships
- **CRUD Operations**: Create, read, update, delete entities
- **Bulk Actions**: Multi-select and bulk operations
- **Search & Filtering**: Real-time search and filtering capabilities
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Accessibility**: Keyboard navigation and ARIA labels

## Development

The project follows a strict architecture pattern:

- **Components**: Pure UI components with explicit prop types
- **Hooks**: Business logic and state management
- **Store**: Centralized state with Zustand
- **API**: Simulated data layer with fixtures
- **Validation**: Zod schemas for type-safe forms

## License

Private project - All rights reserved.
