# App Pipeline

This document explains the runtime flow of the current WedSnap app and the intended production flow we are building toward.

## 1. Browser Entry Pipeline

1. The browser loads [index.html](../index.html).
2. Vite mounts the React app through [main.tsx](../src/main.tsx).
3. `main.tsx` loads the global stylesheet from [globals.css](../src/styles/globals.css).
4. `main.tsx` renders [App.tsx](../src/app/App.tsx).
5. `App.tsx` delegates routing to [router.tsx](../src/app/router.tsx).
6. The router wraps each page in [AppShell.tsx](../src/shared/layouts/AppShell.tsx).
7. The selected route renders the feature page, such as:
   - [GuestUploadPage.tsx](../src/features/guest-upload/pages/GuestUploadPage.tsx)
   - [AdminDashboardPage.tsx](../src/features/admin/pages/AdminDashboardPage.tsx)

## 2. Guest Upload Page Pipeline

This is the current flow inside the guest page:

1. The user opens `/upload?t=<qr-token>`.
2. [GuestUploadPage.tsx](../src/features/guest-upload/pages/GuestUploadPage.tsx) reads the QR token from the URL.
3. The page captures lightweight device context through [getDeviceContext.ts](../src/lib/device/getDeviceContext.ts).
4. The guest name and selected files are stored in local React state.
5. The page delegates file picking to [UploadDropzone.tsx](../src/features/guest-upload/components/UploadDropzone.tsx).
6. The page delegates selected-file rendering to [PhotoSelectionSummary.tsx](../src/features/guest-upload/components/PhotoSelectionSummary.tsx).
7. Validation rules come from [guestUploadSchema.ts](../src/features/guest-upload/lib/guestUploadSchema.ts).

## 3. Guest Upload Production Pipeline

This is the intended end-to-end production flow:

1. Guest scans a table QR code.
2. The app receives the QR token in the URL.
3. The frontend validates the form and prepares device metadata.
4. The frontend calls a Supabase Edge Function.
5. The backend verifies the QR token and creates an upload batch.
6. The backend returns signed upload URLs.
7. The frontend compresses images before upload.
8. Files are uploaded to the private `fotos-boda` bucket.
9. The backend registers uploaded files in the `photos` table.
10. Admins later review them from the private dashboard.

## 4. Admin Pipeline

The current admin route is a scaffold for the future dashboard:

1. The user opens `/admin`.
2. [router.tsx](../src/app/router.tsx) renders [AdminDashboardPage.tsx](../src/features/admin/pages/AdminDashboardPage.tsx).
3. In the production version, this page will:
   - require Supabase Auth
   - query batches and photos
   - generate private access to storage assets
   - support favorites, filters, and downloads

## 5. Environment and Supabase Pipeline

1. Public environment variables are read from Vite at build/runtime.
2. [env.ts](../src/lib/config/env.ts) validates and exposes client-safe config.
3. [client.ts](../src/lib/supabase/client.ts) creates the Supabase browser client.
4. Feature modules import the shared client instead of instantiating their own.

## 6. Styling Pipeline

1. [globals.css](../src/styles/globals.css) defines tokens, layout primitives, and shared component classes.
2. Layout and feature components consume those classes directly.
3. If a visual change affects the whole app, start in `globals.css`.
4. If a visual change is specific to one page, start in that page/component first.

## 7. Debugging Rule Of Thumb

When something breaks, follow this order:

1. Entry and route: `index.html` -> `main.tsx` -> `app/router.tsx`
2. Feature page: route page in `src/features/.../pages`
3. Feature helpers/components: `components/` and `lib/`
4. Shared infrastructure: `src/lib/`, `src/shared/`, `src/styles/`
5. Database and backend contract: `Docs/Db/`
