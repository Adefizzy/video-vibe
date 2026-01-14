import { secondsToTime, TIME_REGEX, timeToSeconds } from '@/lib/utils'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import z from 'zod'

export const useDurationTiming = ({
  form,
}: {
  form: UseFormReturn<z.infer<any>>
}) => {
  const value = form.watch('endTime') || form.watch('startTime')
  const name = value === form.watch('endTime') ? 'endTime' : 'startTime'

  useEffect(() => {
    const start = form.getValues('startTime')
    const end = form.getValues('endTime')

    if (!TIME_REGEX.test(start) || !TIME_REGEX.test(end)) return

    const startSec = timeToSeconds(start)
    const endSec = timeToSeconds(end)

    if (name === 'endTime' && endSec < startSec) {
      form.setValue('endTime', secondsToTime(startSec))
    }

    if (name === 'startTime' && startSec > endSec) {
      form.setValue('startTime', secondsToTime(endSec))
    }
  }, [value])
}
