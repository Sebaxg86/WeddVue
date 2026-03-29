import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/shared/layouts/AppShell'
import { NotFoundPage } from '@/shared/pages/NotFoundPage'

const AuthPage = lazy(() =>
  import('@/features/auth/pages/AuthPage').then((module) => ({
    default: module.AuthPage,
  })),
)

const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)

const EventWorkspacePage = lazy(() =>
  import('@/features/events/pages/EventWorkspacePage').then((module) => ({
    default: module.EventWorkspacePage,
  })),
)

const GuestUploadPage = lazy(() =>
  import('@/features/guest-upload/pages/GuestUploadPage').then((module) => ({
    default: module.GuestUploadPage,
  })),
)

const HomeLandingPage = lazy(() =>
  import('@/features/home/pages/HomeLandingPage').then((module) => ({
    default: module.HomeLandingPage,
  })),
)

function RouteLoadingFallback() {
  return (
    <section className="panel panel--centered">
      <p className="eyebrow">Cargando</p>
      <h1 className="page-title">Preparando la experiencia...</h1>
    </section>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomeLandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/events/:eventId" element={<EventWorkspacePage />} />
            <Route path="/admin" element={<Navigate replace to="/dashboard" />} />
            <Route path="/upload" element={<GuestUploadPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
