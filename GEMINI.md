# GEMINI.md - Project Context & Instructions

This project, **mylink**, contains a Next.js application located in the `my-profile` directory. It is a personal profile or portfolio site built with modern web technologies.

## Project Overview

*   **Main Application:** `my-profile/`
*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS 4 (using `@tailwindcss/postcss`)
*   **UI Components:** React 19
*   **Fonts:** Geist Sans and Geist Mono (via `next/font`)

## Architecture

The project follows the standard Next.js App Router structure:
*   `my-profile/app/`: Contains the application routes, layouts, and global styles.
*   `my-profile/public/`: Static assets like SVG icons and logos.
*   `my-profile/next.config.ts`: Next.js configuration.
*   `my-profile/tailwind.config.ts`: Tailwind CSS configuration (integrated via PostCSS).

## Building and Running

All commands should be executed from within the `my-profile/` directory.

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server at `http://localhost:3000`. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server after building. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

## Development Conventions

*   **App Router:** Use the `app/` directory for all routing and page components.
*   **Server Components:** By default, components in the `app/` directory are React Server Components. Use `"use client"` only when necessary for interactivity.
*   **Styling:** Prefer Tailwind CSS utility classes for styling. Global styles are managed in `app/globals.css`.
*   **TypeScript:** Maintain strict type safety. Avoid using `any`.
*   **Linting:** Adhere to the ESLint configuration provided in `eslint.config.mjs`.

## Key Files

*   `my-profile/app/layout.tsx`: The root layout defining the HTML structure and global fonts.
*   `my-profile/app/page.tsx`: The main landing page of the profile.
*   `my-profile/package.json`: Project dependencies and scripts.
