# WeddVue

WeddVue is a private QR-powered wedding photo platform designed for real events, not just a single demo flow.

## Current Product Surface

- Public landing page with a responsive editorial carousel
- Account creation, login, password reset, and email confirmation through Supabase Auth
- Multi-event owner dashboard
- Event workspace with 3 areas:
  - Tables and QR management
  - Private gallery with favorites, downloads, ZIP export, and lightbox
  - Event settings for title, date, cover image, and guest upload image
- Guest upload flow through QR tokens and anonymous Supabase sessions

## Stack

- React 19
- TypeScript
- Vite
- Supabase Auth, Database, and Storage
- CSS-based design system in `src/styles/globals.css`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure `.env` from `.env.example`
3. Run [Docs/Db/Migration_Script.sql](Docs/Db/Migration_Script.sql) in Supabase
4. Start the app:

```bash
npm run dev
```

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Optional Home Carousel Asset Workflow

If you add new source images to `src/assets/home-carousel/desktop` or `src/assets/home-carousel/mobile`, optimize them before shipping:

```bash
npm run optimize:home-carousel
```

The home carousel consumes the generated `.webp` assets.

## Documentation

Start here:

- [Docs/README.md](Docs/README.md)

Useful next references:

- [Docs/Getting_Started.md](Docs/Getting_Started.md)
- [Docs/Architecture.md](Docs/Architecture.md)
- [Docs/App_Pipeline.md](Docs/App_Pipeline.md)
- [Docs/Module_Map.md](Docs/Module_Map.md)
- [Docs/Db/README.md](Docs/Db/README.md)

## Author

Sebastian Chairez  
Software Engineer  
[GitHub Profile](https://github.com/sebaxg86)
