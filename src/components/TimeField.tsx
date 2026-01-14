import { useEffect } from 'react'
import { timeToSeconds, secondsToTime, TIME_REGEX } from '@/lib/utils'
import { TextField } from './TextField'

interface TimeFieldProps {
  form: any
  name: string
  label: string
  videoDuration: number // seconds
}

export const TimeField = ({
  form,
  name,
  label,
  videoDuration,
}: TimeFieldProps) => {
  const value = form.watch(name)

  useEffect(() => {
    if (!value || !TIME_REGEX.test(value)) return

    const seconds = timeToSeconds(value)

    // Clamp to video duration
    if (seconds > videoDuration) {
      form.setValue(name, secondsToTime(videoDuration))
    }
  }, [value, videoDuration])

  return (
    <TextField
      form={form}
      name={name}
      label={label}
      placeholder="HH:MM:SS"
      type="text"
      pattern="^([0-1]?\d|2[0-3]):([0-5]\d):([0-5]\d)$"
    />
  )
}
