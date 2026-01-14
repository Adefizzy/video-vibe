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

export const FontFamilyInput = () => {
  return (
      <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="font-family">Font Family</Label>
    <Select onValueChange={() => {}}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select font family" />
      </SelectTrigger>
      <SelectContent id="font-family-select">
        <SelectGroup>
          <SelectLabel>Font Family</SelectLabel>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Helvetica">Helvetica</SelectItem>
          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          <SelectItem value="Courier New">Courier New</SelectItem>
          <SelectItem value="Verdana">Verdana</SelectItem>
          <SelectItem value="Georgia">Georgia</SelectItem>
          <SelectItem value="Palatino">Palatino</SelectItem>
          <SelectItem value="Garamond">Garamond</SelectItem>
          <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
          <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
          <SelectItem value="Arial Black">Arial Black</SelectItem>
          <SelectItem value="Impact">Impact</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
  )
}
