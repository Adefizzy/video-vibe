import { useState } from 'react'
import { SketchPicker } from 'react-color'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { UseFormReturn } from 'react-hook-form'
import z from 'zod'
import { cn } from '@/lib/utils'

type Props = {
  form: UseFormReturn<z.infer<any>>
  label?: string
  name: string
  placeholder?: string
  required?: boolean
  type: string
  className?: string
  description?: string
  disabled?: boolean
  defaultValue?: string
}

export const ColorPicker = ({
  form,
  defaultValue = '#000',
  label,
  name,
  placeholder,
  required,
  className,
  description,
}: Props) => {
  const [colorState, setColor] = useState(defaultValue)
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="capitalize">
              {label}
              {required && label && <sup className="">*</sup>}
            </FormLabel>
            <div>
              <FormControl>
                <div className="group relative">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Input
                        {...field}
                        type="text"
                        value={field.value ??  colorState}
                        placeholder={placeholder}
                        readOnly
                        style={{
                          backgroundColor: colorState,
                          color: isLight(colorState) ? '#000' : '#fff',
                        }}
                        className={cn(
                          "cursor-pointer rounded-sm group-aria-invalid:border-red-500 ",
                          className,
                        )}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <SketchPicker
                        color={field.value}
                        onChange={(color: any) => {
                          setColor(color.hex)
                          field.onChange(color.hex)
                          setOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

function isLight(color: string): boolean {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}
