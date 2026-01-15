import { useForm } from 'react-hook-form'
import { getLinkSchema, getTextSchema, getImageSchema } from './helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ElementTypes } from '@/_shared/constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ReactPlayerProps } from 'react-player/types'
import z from 'zod'
import { useDurationTiming } from './useDurationTiming'
import { timeToSeconds } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'

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

const imageElement: ImageElement = {
  type: ElementTypes.IMAGE,
  image: 'https://placehold.co/600x400',
  width: 100,
  height: 100,
  position: {
    x: 50,
    y: 50,
  },
}

export const useVideoBoard = () => {
    const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoPlayerRef = useRef<ReactPlayerProps>(null)
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [elements, setElements] = useState<Array<TextElement | LinkElement | ImageElement>>([])
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
  const ImageSchema = useMemo(
    () => getImageSchema(videoDuration),
    [videoDuration],
  )
  type ITextSchema = z.infer<typeof TextSchema>
  type ILinkSchema = z.infer<typeof LinkSchema>
  type IImageSchema = z.infer<typeof ImageSchema>

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
  const imageForm = useForm<IImageSchema>({
    defaultValues: {
      width: 100,
      height: 100,
    },
    resolver: zodResolver(ImageSchema),
  })
  useDurationTiming({ form: textForm })
  useDurationTiming({ form: linkForm })
  useDurationTiming({ form: imageForm })
  const { watch: watchTextForm } = textForm
  const { watch: watchLinkForm } = linkForm
  const { watch: watchImageForm } = imageForm

  const submitText = (data: ITextSchema) => {
    console.log('Form Data:', data)
  }

  const submitLink = (data: ILinkSchema) => {
    console.log('Link Form Data:', data)
  }

  const submitImage = (data: IImageSchema) => {
    console.log('Image Form Data:', data)
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
      case ElementTypes.IMAGE:
        const newImageElement = { ...imageElement, clientId: uuidv4() }
        setElements([...elements, newImageElement])
        setSelectedElementId(newImageElement.clientId)
        imageForm.reset({
          ...newImageElement,
          width: newImageElement.width ?? 100,
          height: newImageElement.height ?? 100,
          startTime: String(newImageElement.startTime ?? 0),
          endTime: String(newImageElement.endTime ?? 0),
          image: newImageElement.image as File,
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
    updatedElement: Partial<TextElement | LinkElement | ImageElement>,
    selectedElement: TextElement | LinkElement | ImageElement,
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
            ...(selectedElement.type !== ElementTypes.IMAGE && 'fontSize' in updatedElement ? { fontSize: updatedElement.fontSize ? Number(updatedElement.fontSize) : selectedElement.fontSize } : {}),
            width: updatedElement.width ? Number(updatedElement.width) : selectedElement.width,
            height: updatedElement.height ? Number(updatedElement.height) : selectedElement.height,
            borderWidth: updatedElement.borderWidth ? Number(updatedElement.borderWidth) : selectedElement.borderWidth,
            borderRadius: updatedElement.borderRadius ? Number(updatedElement.borderRadius) : selectedElement.borderRadius,
            endTime,
            startTime,
            type: selectedElement.type,
            position: selectedElement.position
          } as TextElement | LinkElement | ImageElement 
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

    if (selectedElement.type === ElementTypes.IMAGE) {
      const subscriptionImage = watchImageForm((data) => {
        updateElement(
          {
            ...data,
            image: data.image ? URL.createObjectURL(data.image) : undefined,
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
      return () => subscriptionImage.unsubscribe()
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

  const handleNavigateToPreview = () => {
    // Save elements to localStorage
    localStorage.setItem('previewElements', JSON.stringify(elements))
    console.log('Saved elements:', elements)
    // Save project details to localStorage
    const project = {
      projectName: 'Demo Project',
      videoUrl: 'https://youtu.be/2Z1oKtxleb4?si=5YQnp50-f5MA5PuA',
    }
    localStorage.setItem('previewProject', JSON.stringify(project))

    // Navigate to preview page
    navigate({ to: '/preview' })
  }

  return {
    textForm,
    submitText,
    linkForm,
    submitLink,
    imageForm,
    submitImage,
    addElement,
    containerRef,
    containerDimensions,
    elements,
    selectedElement,
    videoPlayerRef,
    handleElementSelect,
    setVideoDuration,
    handleDragEnd,
    handleNavigateToPreview
  }
}
