import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'
import { GuestUploadPage } from '@/features/guest-upload/pages/GuestUploadPage'
import { AppShell } from '@/shared/layouts/AppShell'
import { NotFoundPage } from '@/shared/pages/NotFoundPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<GuestUploadPage />} />
          <Route path="/upload" element={<GuestUploadPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
