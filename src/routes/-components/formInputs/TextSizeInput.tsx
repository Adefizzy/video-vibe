import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export const TextSizeInput = () => {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="text-size">Text Size</Label>
      <Select onValueChange={() => {}}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a text size" />
        </SelectTrigger>
        <SelectContent id="text-size-select">
          <SelectGroup>
            <SelectLabel>Text Size</SelectLabel>
            <SelectItem value="11">Small</SelectItem>
            <SelectItem value="14">Medium</SelectItem>
            <SelectItem value="18">Large</SelectItem>
            <SelectItem value="24">Extra Large</SelectItem>
            <SelectItem value="32">Huge</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
