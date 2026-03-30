export type AccountEvent = {
  cover_image_path: string | null
  cover_image_url?: string | null
  created_at: string
  event_date: string | null
  guest_upload_image_path: string | null
  guest_upload_image_url?: string | null
  id: string
  is_active: boolean
  owner_user_id: string
  slug: string
  title: string
}

export type EventSummary = AccountEvent & {
  qr_codes?: Array<{
    id: string
    is_active: boolean
  }> | null
}

export type TableQrRecord = {
  created_at?: string
  event_id: string
  guest_group_name: string | null
  id: string
  is_active: boolean
  last_scanned_at: string | null
  notes?: string | null
  scan_count: number
  table_label: string
  table_number: number
  token: string
}

export type EventPhotoRecord = {
  batch_id: string
  captured_at: string | null
  created_at: string
  file_extension: string | null
  file_size_bytes: number
  guest_group_name: string | null
  guest_name: string
  height: number | null
  id: string
  is_favorite: boolean
  mime_type: string
  original_filename: string | null
  signed_url: string | null
  status: string
  storage_bucket: string
  storage_path: string
  table_label: string
  table_number: number | null
  width: number | null
}
