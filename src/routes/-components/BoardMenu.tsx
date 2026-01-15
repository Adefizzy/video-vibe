import { Button } from "@/components/ui/button"


type Props = {
    onClick: () => void
    icon: React.ReactNode
    text: string
}

export const BoardMenu = (props: Props) => {
  return (
    <Button
      onClick={() => props.onClick()}
      variant="ghost"
      className="ml-2 h-auto py-2"
    >
      <span className="flex flex-col items-center gap-1">
        {props.icon}
        <span className="text-xs leading-none">{props.text}</span>
      </span>
    </Button>
  )
}
