function resolveAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") return "https://app.glamourpos.com"
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return "https://preview.app.glamourpos.com"
  return "http://localhost:3000"
}

export const APP_URL = resolveAppUrl()

export function getAppUrl(): string {
  return resolveAppUrl()
}
