# Mock Data Directory

This directory contains all mock data for the I3M Master Dashboard application.

## Structure

```
mock-data/
├── index.ts                 # Barrel export for all mock data
├── dashboard/               # Dashboard-related mock data
│   ├── index.ts
│   ├── stats.ts
│   ├── activities.ts
│   └── system-status.ts
├── scrum/                  # Scrum/Agile management mock data
│   ├── index.ts
│   ├── tasks.ts
│   ├── sprints.ts
│   ├── team.ts
│   └── reports.ts
├── support/                # Support management mock data
│   ├── index.ts
│   ├── tickets.ts
│   ├── agents.ts
│   └── knowledge-base.ts
├── customers/              # Customer management mock data
│   ├── index.ts
│   ├── customers.ts
│   └── segments.ts
├── security/               # Security center mock data
│   ├── index.ts
│   ├── threats.ts
│   └── incidents.ts
└── workflow/               # Workflow management mock data
    ├── index.ts
    ├── workflows.ts
    └── executions.ts
```

## Usage

Import mock data from the centralized barrel export:

```typescript
import { mockTasks, mockSprint, mockTeamMembers } from '@/mock-data';
```

Or import from specific modules:

```typescript
import { mockTasks } from '@/mock-data/scrum';
import { mockDashboardStats } from '@/mock-data/dashboard';
```

## Benefits

1. **Centralized Management**: All mock data in one place
2. **Type Safety**: TypeScript interfaces for all data structures
3. **Easy Maintenance**: Clear organization by feature
4. **Reusability**: Shared across components and pages
5. **Development**: Consistent data for development and testing
