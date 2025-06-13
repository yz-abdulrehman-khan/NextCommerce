# Next.js E-Commerce Application

A small-scale e-commerce application built with Next.js (App Router), React, TypeScript, and Tailwind CSS. This project demonstrates modern frontend development practices, including component-based architecture, state management, routing, and API integration.

## Core Technologies

*   **Next.js (App Router):** For routing, Server Components, Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and API routes.
*   **React 18+:** For building the user interface with components.
*   **TypeScript:** For static typing, enhancing code quality and maintainability.
*   **Tailwind CSS:** For utility-first styling, enabling rapid UI development.
*   **shadcn/ui:** For a collection of pre-built, accessible, and customizable UI components (e.g., Button, Card, Input, Sheet, Toast).
*   **Lucide React:** For icons.
*   **Mock API:** An in-memory mock API (via `src/lib/api.ts` and Next.js API Routes) simulates backend services for products, categories, and orders.

## Features

*   Product Listing & Detail Pages
*   Category Browsing
*   Shopping Cart (Client-side with Local Storage persistence)
*   Checkout Process (Mock payment)
*   Order History
*   Responsive Design
*   Loading & Error States
*   Subtle UI Animations & Transitions

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended, e.g., v18.x or v20.x)
*   npm (v8+) or yarn (v1.22+)

### Installation

1.  Clone the repository (or download the source code).
2.  **Create an environment file.** Create a file named `.env.local` in the root of the project and add the following line:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```
4.  Navigate to the project directory:
    ```bash
    cd your-project-name
    ```
5.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

1.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
2.  Open your browser and navigate to `http://localhost:3000`.

The application will automatically reload if you make changes to the code.

### Building for Production

1.  Create a production build:
    ```bash
    npm run build
    # or
    yarn build
    ```
    This command will create an optimized build of your application in the `.next` folder.

### Running the Production Server

1.  After building, start the production server:
    ```bash
    npm start
    # or
    yarn start
    ```
2.  Open your browser and navigate to `http://localhost:3000` (or the port Next.js indicates).

## Folder Structure Overview

```
NextCommerce/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, API routes)
│   │   ├── (app)/          # Route group for main application layout
│   │   │   ├── categories/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── ... (page.tsx, layout.tsx, loading.tsx, error.tsx)
│   │   ├── api/            # API route handlers
│   │   ├── fonts/
│   │   ├── globals.css
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── cart/
│   │   ├── category/
│   │   ├── checkout/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── order/
│   │   ├── product/
│   │   └── ui/             # shadcn/ui components
│   ├── config/             # Application configuration (constants)
│   ├── context/            # React Context providers (e.g., CartContext)
│   ├── hooks/              # Custom React hooks (e.g., useForm, useToast)
│   ├── lib/                # Utility functions, API client, mock API data
│   └── types/              # TypeScript type definitions
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md               # This file
├── tailwind.config.ts
└── tsconfig.json
```

## Available Scripts

In the project directory, you can run:

*   `npm run dev` or `yarn dev`: Runs the app in development mode.
*   `npm run build` or `yarn build`: Builds the app for production.
*   `npm start` or `yarn start`: Starts the production server (after building).
*   `npm run lint` or `yarn lint`: Lints the codebase (if configured in `package.json`).

## Environment Variables

*   `NEXT_PUBLIC_API_URL`: The base URL for the API. This is required for the application to make API calls correctly. For local development, it should be set to `http://localhost:3000`.

---

This README provides a basic overview. Feel free to expand it with more details about specific features, deployment instructions, or contribution guidelines.
