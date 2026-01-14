import { useForm } from 'react-hook-form'
import { getLinkSchema, getTextSchema } from './helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ElementTypes } from '@/_shared/constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ReactPlayerProps } from 'react-player/types'
import z from 'zod'
import { useDurationTiming } from './useDurationTiming'
import { timeToSeconds } from '@/lib/utils'

const textElement: TextElement = {
  type: ElementTypes.TEXT,
  content: 'New Text',
  bgColor: '#000',
  textColor: '#fff',
  fontSize: 26,
  fontFamily: 'Calibri',
  align: 'left',
  position: {
    x: 50,
    y: 50,
  },
}

const linkElement: LinkElement = {
  type: ElementTypes.LINK,
  url: 'https://www.google.com',
  content: 'New Link',
  bgColor: '#000',
  textColor: '#fff',
  fontSize: 26,
  fontFamily: 'Calibri',
  align: 'left',
  position: {
    x: 50,
    y: 50,
  },
}

export const useVideoBoard = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoPlayerRef = useRef<ReactPlayerProps>(null)
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [elements, setElements] = useState<Array<TextElement | LinkElement>>([])
  const [selectedElementId, setSelectedElementId] = useState<string>('')
  const [videoDuration, setVideoDuration] = useState<number>(0)
  console.log('elemens:', elements)

  const TextSchema = useMemo(
    () => getTextSchema(videoDuration),
    [videoDuration],
  )
  const LinkSchema = useMemo(
    () => getLinkSchema(videoDuration),
    [videoDuration],
  )
  type ITextSchema = z.infer<typeof TextSchema>
  type ILinkSchema = z.infer<typeof LinkSchema>

  useEffect(() => {
    if (containerRef.current) {
      setContainerDimensions(containerRef.current.getBoundingClientRect())
    }
  }, [containerRef.current])

  const textForm = useForm<ITextSchema>({
    defaultValues: {
      content: '',
      bgColor: '#000',
      // align: 'left',
    },
    resolver: zodResolver(TextSchema),
  })
  const linkForm = useForm<ILinkSchema>({
    defaultValues: {
      content: '',
      url: '',
      // align: 'left',
    },
    resolver: zodResolver(LinkSchema),
  })
  useDurationTiming({ form: textForm })
  useDurationTiming({ form: linkForm })
  const { watch: watchTextForm } = textForm
  const { watch: watchLinkForm } = linkForm

  const submitText = (data: ITextSchema) => {
    console.log('Form Data:', data)
  }

  const submitLink = (data: ILinkSchema) => {
    console.log('Link Form Data:', data)
  }

  const addElement = (type: ElementTypes) => {
    switch (type) {
      case ElementTypes.TEXT:
        const newElement = { ...textElement, clientId: uuidv4() }
        setElements([...elements, newElement])
        setSelectedElementId(newElement.clientId)
        textForm.reset({
          ...newElement,
          fontSize: String(newElement.fontSize ?? 12),
          startTime: String(newElement.startTime ?? 0),
          endTime: String(newElement.endTime ?? 0),
        })

        break
      case ElementTypes.LINK:
        const newLinkElement = { ...linkElement, clientId: uuidv4() }
        setElements([...elements, newLinkElement])
        setSelectedElementId(newLinkElement.clientId)
        linkForm.reset({
          ...newLinkElement,
          fontSize: String(newLinkElement.fontSize ?? 12),
          startTime: String(newLinkElement.startTime ?? 0),
          endTime: String(newLinkElement.endTime ?? 0),
        })
        break
      default:
        break
    }
  }

  const selectedElement = useMemo(
    () => elements.find((el) => el.clientId === selectedElementId),
    [elements, selectedElementId],
  )

  const updateElement = (
    updatedElement: Partial<TextElement | LinkElement>,
    selectedElement: TextElement | LinkElement,
  ) => {
    setElements((prevElements) =>
      prevElements.map((el) => {
        if (el.clientId === selectedElement.clientId) {
          const endTime = updatedElement.endTime
            ? Number(updatedElement.endTime)
            : selectedElement.endTime || 0
          const startTime = updatedElement.startTime
            ? Number(updatedElement.startTime)
            : selectedElement.startTime || 0
          return {
            ...selectedElement,
            ...updatedElement,
            fontSize: Number(updatedElement.fontSize),
            endTime,
            startTime,
            type: selectedElement.type,
            position: selectedElement.position
          } as TextElement | LinkElement
        }
        return el
      }),
    )
  }

  useEffect(() => {
    if (!selectedElement) return

    if (selectedElement.type === ElementTypes.TEXT) {
      const subscriptionText = watchTextForm((data) => {
        updateElement(
          {
            ...data,
            fontSize: data.fontSize ? Number(data.fontSize) : undefined,
            startTime: data.startTime
              ? Number(timeToSeconds(data.startTime))
              : undefined,
            endTime: data.endTime
              ? Number(timeToSeconds(data.endTime))
              : undefined,
          },
          selectedElement,
        )
      })
      return () => subscriptionText.unsubscribe()
    }

    if (selectedElement.type === ElementTypes.LINK) {
      const subscriptionLink = watchLinkForm((data) => {
        updateElement(
          {
            ...data,
            fontSize: data.fontSize ? Number(data.fontSize) : undefined,
            startTime: data.startTime
              ? Number(timeToSeconds(data.startTime))
              : undefined,
            endTime: data.endTime
              ? Number(timeToSeconds(data.endTime))
              : undefined,
          },
          selectedElement,
        )
      })
      return () => subscriptionLink.unsubscribe()
    }
  }, [selectedElement, watchTextForm, watchLinkForm])

  const handleElementSelect = (clientId?: string) => {
    if (!clientId) return
    setSelectedElementId(clientId)
  }

  const handleDragEnd = ({
    clientId,
    x,
    y,
  }: {
    clientId: string
    x: number
    y: number
  }) => {
    setElements((prevElements) =>
      prevElements.map((el) => {
        if (el.clientId === clientId) {
          return {
            ...el,
            position: { x, y },
          }
        }
        return el
      }),
    )
  }

  return {
    textForm,
    submitText,
    linkForm,
    submitLink,
    addElement,
    containerRef,
    containerDimensions,
    elements,
    selectedElement,
    videoPlayerRef,
    handleElementSelect,
    setVideoDuration,
    handleDragEnd,
  }
}
