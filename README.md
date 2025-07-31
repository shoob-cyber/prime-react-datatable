# React + TypeScript + Vite Art Gallery App
This template provides a production-ready setup for building an art gallery application with React, TypeScript, and Vite. It includes PrimeReact for UI components, server-side pagination, and artwork selection functionality.

# Features
🚀 Vite-powered development with HMR

⚡ TypeScript for type safety

🎨 PrimeReact UI components

🖼️ Art Institute of Chicago API integration

📊 Server-side pagination

✅ Multi-select functionality with persistent selection

📱 Responsive design
# Getting Started
Prerequisites
Node.js (v16 or later recommended)

npm or yarn

# Installation
Clone the repository

bash
git clone [https://github.com/your-repo/art-gallery-app.git](https://github.com/shoob-cyber/prime-react-datatable)
cd art-gallery-app
Install dependencies

bash
npm install
# or
yarn install
Start the development server

bash
npm run dev
# or
yarn dev
# Project Structure
text
art-gallery-app/
├── src/
│   ├── components/
│   │   └── DataTableComponent.tsx    # Main artwork display component
│   ├── App.tsx                       # Root component
│   ├── main.tsx                      # Entry point
│   └── App.css                       # Global styles
├── public/                           # Static assets
├── package.json
├── tsconfig.json                     # TypeScript config
└── vite.config.ts                    # Vite config
# Key Technologies
Vite - Next generation frontend tooling

React - JavaScript library for building user interfaces

TypeScript - Typed JavaScript

PrimeReact - UI component library

Axios - HTTP client

# Available Scripts
dev - Start development server

build - Build for production

preview - Preview production build

lint - Run ESLint

type-check - Run TypeScript type checker

# Configuration
Environment Variables
Create a .env file in the root directory:

env
VITE_API_BASE_URL=https://api.artic.edu/api/v1
ESLint
The project includes comprehensive ESLint configuration with:

TypeScript support

React-specific rules

Prettier integration

To customize linting rules, modify the eslint.config.js file.

# Deployment
Building for Production
bash
npm run build
# or
yarn build
This will create a production-ready build in the dist directory.

# Deploy to Vercel
https://vercel.com/button

API Documentation
This app uses the Art Institute of Chicago API. Key endpoints:

GET /artworks - Retrieve paginated artwork data

GET /artworks/{id} - Get details for a specific artwork

# Contributing
Fork the repository

Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -am 'Add some feature')

Push to the branch (git push origin feature/your-feature)

Open a Pull Request

# License
MIT License. See LICENSE for more information











# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
