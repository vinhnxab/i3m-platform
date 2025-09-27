# I3M Master Dashboard

A modern, enterprise-grade React dashboard built with Vite, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Framer Motion** for animations
- **Lucide React** for icons
- **Modular Architecture** with feature-based structure
- **Type-safe** throughout the application

## 📁 Project Structure

```
src/
├── app/                    # Application layer
│   ├── providers/         # Context providers
│   ├── router/           # Routing configuration
│   ├── App.tsx           # Root component
│   └── MainDashboard.tsx # Main layout
├── features/             # Feature-based modules
│   ├── dashboard/        # Dashboard feature
│   └── erp/             # ERP feature
├── shared/              # Shared utilities
│   ├── components/      # Reusable components
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   └── types/          # TypeScript types
└── components/         # Legacy components (temporary)
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=I3M Platform
VITE_APP_VERSION=2.0.0
```

## 🏗️ Architecture

### Feature-Based Structure

Each feature is self-contained with:
- `components/` - Feature-specific components
- `hooks/` - Custom hooks for data management
- `types.ts` - TypeScript interfaces
- `index.ts` - Barrel exports

### Shared Components

- `@/shared/components/ui` - UI components (Shadcn)
- `@/shared/components/common` - Common components
- `@/shared/components/layout` - Layout components

### Services Layer

- `@/shared/services/api` - HTTP client
- `@/shared/services/auth` - Authentication

## 🎨 Design System

- **Apple-inspired** design language
- **Responsive** mobile-first approach
- **Dark/Light** theme support
- **Smooth animations** with Framer Motion

## 📱 Features

- **Dashboard Overview** - System stats and monitoring
- **ERP Management** - Project and invoice management
- **Responsive Design** - Works on all devices
- **Theme Toggle** - Dark/light mode
- **Language Support** - Multi-language ready
- **Real-time Updates** - Live data updates

## 🔧 Configuration

### TypeScript

- Strict mode enabled
- Path mapping with `@/` alias
- React JSX transform

### Vite

- Fast HMR (Hot Module Replacement)
- TypeScript support
- Path aliases configured

### Tailwind CSS

- Custom design system
- Responsive utilities
- Dark mode support

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Output will be in dist/ directory
# Deploy dist/ to your hosting service
```

## 🤝 Contributing

1. Follow the established architecture patterns
2. Use TypeScript for all new code
3. Follow the feature-based structure
4. Add proper type definitions
5. Use the shared components when possible

## 📄 License

Private - I3M Platform