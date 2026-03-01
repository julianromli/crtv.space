# crtv.space

crtv.space is a Next.js app for visual inspiration and creative workflow management.

## Features

- Inspiration gallery with image modal preview
- Profile page with editable user details
- Workspace page with canvas layout and side panels
- Built with Next.js App Router, React, TypeScript, and Tailwind CSS

## Requirements

- Node.js 20+
- npm

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your local env file from the example:

```bash
cp .env.example .env.local
```

3. Set values in `.env.local`:

- `GEMINI_API_KEY` (required for Gemini API calls)
- `APP_URL` (app base URL for local or deployed runtime)

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000` in your browser.

## Available Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Create production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run clean` - Run Next.js cleanup

## Project Routes

- `/` - Home gallery
- `/profile` - Profile view
- `/workspace` - Canvas workspace
