import { useState } from "react"
import { SketchPicker } from "react-color"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Props = {
  color: string
  onChange: (color: string) => void
  label?: string
}

export const ColorPicker = (props: Props) => {
    const [color, setColor] = useState(props.color)
    const [open, setOpen] = useState(false)
    
    const handleChange = (color: any) => {
        setColor(color.hex)
        props.onChange(color.hex)
        setOpen(false)
    }
    
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      {props.label && <Label>{props.label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            type="text"
            value={color}
            readOnly
            className="cursor-pointer"
            style={{ backgroundColor: color, color: isLight(color) ? "#000" : "#fff" }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <SketchPicker color={color} onChange={handleChange} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function isLight(color: string): boolean {
  const hex = color.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}