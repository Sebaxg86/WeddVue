export type AccountEvent = {
  created_at: string
  event_date: string | null
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
