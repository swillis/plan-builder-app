# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production (runs TypeScript check then Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview the production build locally

## Project Architecture

This is a React + TypeScript + Vite application for building workout training plans. The architecture is:

### Tech Stack
- **Frontend**: React 19.1.0 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.3 with React plugin
- **Styling**: Tailwind CSS 3.4.1 with PostCSS/Autoprefixer
- **Icons**: Lucide React 0.525.0
- **Linting**: ESLint 9.30.1 with TypeScript ESLint and React hooks/refresh plugins

### Application Structure
- **Entry Point**: `src/main.tsx` renders the App component into the DOM
- **Main App**: `src/App.tsx` is a simple wrapper that renders the PlanBuilder component
- **Core Component**: `src/PlanBuilder.tsx` contains the entire application logic

### Key Components in PlanBuilder.tsx
- **ExerciseSelector**: Searchable dropdown with comprehensive exercise database (lines 4-176)
  - Contains ~80 exercises across 10 muscle groups (Chest, Back, Shoulders, Biceps, Triceps, Quads, Hamstrings, Glutes, Calves, Abs)
  - Supports search by name, category, or muscle group
  - Shows primary/secondary muscle information
- **TrainingPlanBuilder**: Main component managing the entire workout plan (lines 178-543)
  - Handles user preferences (experience level, training days, focus areas)
  - Manages training days with exercises and sets
  - Provides real-time analysis and recommendations

### State Management
All state is managed locally with React hooks:
- `experience` - User's training experience level
- `focusAreas` - Selected muscle groups to prioritize
- `trainingDays` - Number of training days per week
- `days` - Array of training days with exercises

### Key Features
- **Real-time Analysis**: Volume and frequency calculations for each muscle group
- **Exercise Database**: Comprehensive list with muscle group classifications
- **Recommendations**: Automatic feedback based on training volume and focus areas
- **Responsive Design**: Grid layout that adapts to different screen sizes

### Data Structure
Exercise objects contain:
- `name` - Exercise name
- `primaryMuscle` - Primary muscle group worked
- `secondaryMuscle` - Secondary muscle group (optional)
- `category` - Classification for grouping
- `sets` - Number of sets (user-defined)

### Development Notes
- Uses TypeScript strict mode with separate configs for app and build tooling
- Tailwind configured for src files and index.html
- ESLint configured with React hooks and refresh plugins
- No testing framework currently configured
- No external state management library (Redux, Zustand, etc.)