import { formatDistanceToNowStrict, format } from "date-fns"

export function formatRelative(date: Date) {
  const distance = formatDistanceToNowStrict(date, { addSuffix: true })
  return distance
}

export function parseUtcString(dateString: string): Date {
  const date = new Date(dateString)
  
  const utcTimezoneOffsetHours = -(date.getTimezoneOffset() / 60)
  date.setHours(date.getHours() + utcTimezoneOffsetHours)

  return date
}

export function formatFullDate(date: Date) {
  const formattedDate = format(date, 'MM/dd/yyyy HH:mm:ss');
  return formattedDate
}
