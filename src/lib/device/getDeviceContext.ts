export type DeviceContext = {
  language: string
  timezone: string
  screenHeight: number
  screenWidth: number
  userAgent: string
}

const defaultContext: DeviceContext = {
  language: 'unknown',
  timezone: 'unknown',
  screenHeight: 0,
  screenWidth: 0,
  userAgent: 'unknown',
}

export function getDeviceContext(): DeviceContext {
  if (typeof window === 'undefined') {
    return defaultContext
  }

  return {
    language: window.navigator.language || 'unknown',
    timezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone || defaultContext.timezone,
    screenHeight: window.screen.height,
    screenWidth: window.screen.width,
    userAgent: window.navigator.userAgent,
  }
}
