import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// time.ts
export const timeToSeconds = (time: string) => {
  const [h = 0, m = 0, s = 0] = time.split(':').map(Number)
  return h * 3600 + m * 60 + s
}

export const secondsToTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  return [
    h.toString().padStart(2, '0'),
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0'),
  ].join(':')
}


export const TIME_REGEX =
  /^([0-1]?\d|2[0-3]):([0-5]\d):([0-5]\d)$/