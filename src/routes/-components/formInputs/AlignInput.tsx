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

export const AlignInput = () => {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="text-align-select">Text Align</Label>
      <Select onValueChange={() => {}}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select alignment" />
        </SelectTrigger>
        <SelectContent id="text-align-select">
          <SelectGroup>
            <SelectLabel>Alignment</SelectLabel>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
