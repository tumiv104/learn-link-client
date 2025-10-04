// utils/formatDateTime.ts
export function formatDateTime(dateString: string, locale: string) {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date)
}
