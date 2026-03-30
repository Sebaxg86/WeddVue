# Module Map

Use this document to answer the practical question:

**If I want to modify X, where do I touch?**

## Core Rule

- `src/app/` controls app entry and routing.
- `src/features/` contains feature-specific UI and logic.
- `src/lib/` contains shared technical integrations.
- `src/shared/` contains reusable layout and generic utilities.
- `src/styles/` contains global styling tokens and shared CSS.
- `Docs/Db/` contains the database source-of-truth workflow.

## If I Want To Modify X

### Routes and navigation

- Add or change pages: [router.tsx](../src/app/router.tsx)
- Change the top navigation or shell layout: [AppShell.tsx](../src/shared/layouts/AppShell.tsx)
- Change the public landing page at `/`: [HomeLandingPage.tsx](../src/features/home/pages/HomeLandingPage.tsx)
- Change the not-found experience: [NotFoundPage.tsx](../src/shared/pages/NotFoundPage.tsx)

### Authentication and account access

- Change the login/signup page at `/auth`: [AuthPage.tsx](../src/features/auth/pages/AuthPage.tsx)
- Change the auth form UI and mode toggle: [AuthForm.tsx](../src/features/auth/components/AuthForm.tsx)
- Change how browser sessions are detected, including anonymous-vs-account session logic: [useSupabaseSession.ts](../src/lib/supabase/useSupabaseSession.ts)

### Account dashboard

- Change the main owner dashboard at `/dashboard`: [DashboardPage.tsx](../src/features/dashboard/pages/DashboardPage.tsx)
- Change the create-event card and owner summary: [CreateEventPanel.tsx](../src/features/dashboard/components/CreateEventPanel.tsx)
- Change each event card in the dashboard list: [EventCard.tsx](../src/features/dashboard/components/EventCard.tsx)

### Event workspace and QR setup

- Change the event workspace page at `/dashboard/events/:eventId`: [EventWorkspacePage.tsx](../src/features/events/pages/EventWorkspacePage.tsx)
- Change the table-count generation flow and workspace tabs: [EventWorkspacePage.tsx](../src/features/events/pages/EventWorkspacePage.tsx)
- Change each table card, QR actions, or mobile QR controls: [TableQrCard.tsx](../src/features/events/components/TableQrCard.tsx)
- Change the private gallery cards: [EventPhotoCard.tsx](../src/features/events/components/EventPhotoCard.tsx)
- Change the gallery lightbox: [EventGalleryLightbox.tsx](../src/features/events/components/EventGalleryLightbox.tsx)
- Change event cover/guest image pickers: [EventImageField.tsx](../src/features/events/components/EventImageField.tsx)
- Change event image storage and signed URLs: [eventAssetStorage.ts](../src/features/events/lib/eventAssetStorage.ts)
- Change event-side types: [eventTypes.ts](../src/features/events/lib/eventTypes.ts)
- Change how frontend QR tokens are generated before saving: [generateQrToken.ts](../src/features/events/lib/generateQrToken.ts)

### Guest upload screen

- Change the main upload page: [GuestUploadPage.tsx](../src/features/guest-upload/pages/GuestUploadPage.tsx)
- Change the file-picker block: [UploadDropzone.tsx](../src/features/guest-upload/components/UploadDropzone.tsx)
- Change the selected-files list: [PhotoSelectionSummary.tsx](../src/features/guest-upload/components/PhotoSelectionSummary.tsx)
- Change the real Supabase upload orchestration, anonymous session handling, and RPC calls: [guestUploadService.ts](../src/features/guest-upload/lib/guestUploadService.ts)

### Upload rules and validation

- Change max photos per batch or form validation: [guestUploadSchema.ts](../src/features/guest-upload/lib/guestUploadSchema.ts)
- Change size formatting: [formatFileSize.ts](../src/shared/utils/formatFileSize.ts)

### Device traceability

- Change client-side device metadata capture: [getDeviceContext.ts](../src/lib/device/getDeviceContext.ts)
- Change what is stored in the database: [Migration_Script.sql](Db/Migration_Script.sql)

### Supabase connection

- Change environment variable parsing: [env.ts](../src/lib/config/env.ts)
- Change how the browser Supabase client is created: [client.ts](../src/lib/supabase/client.ts)
- Change the example environment variables: [.env.example](../.env.example)

### Global look and feel

- Change colors, spacing, typography, layout primitives, buttons, cards, or responsive behavior: [globals.css](../src/styles/globals.css)
- Change the shared editorial footer: [EditorialFooter.tsx](../src/shared/components/EditorialFooter.tsx)
- Change the private dashboard/event layout frame: [PrivateEditorialLayout.tsx](../src/shared/layouts/PrivateEditorialLayout.tsx)
- Change the home carousel behavior: [HomeHeroCarousel.tsx](../src/features/home/components/HomeHeroCarousel.tsx)
- Change document-level metadata like title or description: [index.html](../index.html)
- Change the favicon: [favicon.svg](../public/favicon.svg)

### App startup and rendering

- Change the React mount point: [main.tsx](../src/main.tsx)
- Change the top-level app handoff: [App.tsx](../src/app/App.tsx)

### Database

- Apply a new database change in Supabase: [Migration_Script.sql](Db/Migration_Script.sql)
- Check the current exported database shape: [Database_schema.sql](Db/Database_schema.sql)
- Seed an owner-linked event and QR rows manually: [Supabase_seed_template.sql](Db/Supabase_seed_template.sql)
- Understand the database workflow: [Docs/Db/README.md](Db/README.md)

### Tooling and project configuration

- Change npm scripts or dependencies: [package.json](../package.json)
- Change TypeScript path aliases or compiler rules: [tsconfig.app.json](../tsconfig.app.json)
- Change root TypeScript project references: [tsconfig.json](../tsconfig.json)
- Change Vite behavior or aliases: [vite.config.ts](../vite.config.ts)
- Change lint rules: [eslint.config.js](../eslint.config.js)

### Documentation

- Change the docs index: [Docs/README.md](README.md)
- Change setup instructions: [Getting_Started.md](Getting_Started.md)
- Change system-level explanation: [Architecture.md](Architecture.md)
- Change the runtime explanation: [App_Pipeline.md](App_Pipeline.md)

## Fast Mental Model

If the change is:

- visual: start in `src/styles/` or the feature component
- route-related: start in `src/app/router.tsx`
- account access: start in `src/features/auth/`
- owner dashboard: start in `src/features/dashboard/`
- event setup or QR logic: start in `src/features/events/`
- guest upload: start in `src/features/guest-upload/`
- infrastructure-related: start in `src/lib/`
- cross-cutting UI: start in `src/shared/`
- database-related: start in `Docs/Db/`
