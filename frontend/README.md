# Frontend - Beka Bayecha Portfolio

This is the frontend application for Beka Bayecha's portfolio website, built with React, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Features

- Responsive design with dark/light theme support
- Modern UI with essential components
- Smooth animations with Framer Motion
- Contact form integration
- Project showcase
- Skills and services sections
- Optimized bundle size with minimal dependencies

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, minimal shadcn/ui components
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Build

```bash
# Production build
npm run build
# or
bun run build
```

## Project Structure

```
src/
├── components/     # Organized React components
│   ├── layout/    # Navbar, Footer
│   ├── sections/  # Hero, About, Skills, etc.
│   ├── common/    # Reusable components
│   └── ui/        # Essential UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── pages/         # Page components
└── assets/        # Static assets
```

## Documentation

- [Development Guide](DEVELOPMENT.md) - Setup, scripts, and development workflow
- [Project Structure](PROJECT_STRUCTURE.md) - Detailed project organization
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
- [Deployment Guide](DEPLOYMENT.md) - Deployment options and instructions

## License

MIT
