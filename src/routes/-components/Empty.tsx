import {  FolderIcon } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ReactNode } from 'react'

export function EmptyComp({ videoInput }: { videoInput: ReactNode }) {
  return (
    <Empty className="w-full h-full bg-black">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You have not added video link yet, add video link and start annotating
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{videoInput}</EmptyContent>
    </Empty>
  )
}
