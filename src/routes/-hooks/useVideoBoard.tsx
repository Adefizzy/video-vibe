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

const defaultElements = {
  [ElementTypes.TEXT]: {
    type: ElementTypes.TEXT,
    content: 'New Text',
    bgColor: '#000',
    textColor: '#fff',
    fontSize: 26,
    fontFamily: 'Calibri',
    align: 'left',
    position: { x: 50, y: 50 },
  } as TextElement,
  [ElementTypes.LINK]: {
    type: ElementTypes.LINK,
    url: 'https://www.google.com',
    content: 'New Link',
    bgColor: '#000',
    textColor: '#fff',
    fontSize: 26,
    fontFamily: 'Calibri',
    align: 'left',
    position: { x: 50, y: 50 },
  } as LinkElement,
  [ElementTypes.IMAGE]: {
    type: ElementTypes.IMAGE,
    image: 'https://placehold.co/600x400',
    width: 100,
    height: 100,
    position: { x: 50, y: 50 },
  } as ImageElement,
}

export const useVideoBoard = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoPlayerRef = useRef<ReactPlayerProps>(null)
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [elements, setElements] = useState<
    Array<TextElement | LinkElement | ImageElement>
  >([])
  const [selectedElementId, setSelectedElementId] = useState<string>('')
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [videoLink, setVideoLink] = useState('')

  const schemas = useMemo(
    () => ({
      [ElementTypes.TEXT]: getTextSchema(videoDuration),
      [ElementTypes.LINK]: getLinkSchema(videoDuration),
      [ElementTypes.IMAGE]: getImageSchema(videoDuration),
    }),
    [videoDuration],
  )

  type SchemaTypes = {
    [ElementTypes.TEXT]: z.infer<(typeof schemas)[ElementTypes.TEXT]>
    [ElementTypes.LINK]: z.infer<(typeof schemas)[ElementTypes.LINK]>
    [ElementTypes.IMAGE]: z.infer<(typeof schemas)[ElementTypes.IMAGE]>
  }

  const forms = {
    [ElementTypes.TEXT]: useForm<SchemaTypes[ElementTypes.TEXT]>({
      defaultValues: { content: '', bgColor: '#000' },
      resolver: zodResolver(schemas[ElementTypes.TEXT]),
    }),
    [ElementTypes.LINK]: useForm<SchemaTypes[ElementTypes.LINK]>({
      defaultValues: { content: '', url: '' },
      resolver: zodResolver(schemas[ElementTypes.LINK]),
    }),
    [ElementTypes.IMAGE]: useForm<SchemaTypes[ElementTypes.IMAGE]>({
      defaultValues: { width: 100, height: 100 },
      resolver: zodResolver(schemas[ElementTypes.IMAGE]),
    }),
  }

  useDurationTiming({ form: forms[ElementTypes.TEXT] })
  useDurationTiming({ form: forms[ElementTypes.LINK] })
  useDurationTiming({ form: forms[ElementTypes.IMAGE] })

  useEffect(() => {
    if (containerRef.current) {
      setContainerDimensions(containerRef.current.getBoundingClientRect())
    }
  }, [containerRef.current])

  const { watch: watchTextForm } = forms[ElementTypes.TEXT]
  const { watch: watchLinkForm } = forms[ElementTypes.LINK]
  const { watch: watchImageForm } = forms[ElementTypes.IMAGE]

  const submitFunctions = {
    [ElementTypes.TEXT]: (data: SchemaTypes[ElementTypes.TEXT]) =>
      console.log('Form Data:', data),
    [ElementTypes.LINK]: (data: SchemaTypes[ElementTypes.LINK]) =>
      console.log('Link Form Data:', data),
    [ElementTypes.IMAGE]: (data: SchemaTypes[ElementTypes.IMAGE]) =>
      console.log('Image Form Data:', data),
  }

  const addElement = (type: ElementTypes) => {
    const defaultElement = defaultElements[type]
    const newElement = { ...defaultElement, clientId: uuidv4() }
    setElements([...elements, newElement])
    setSelectedElementId(newElement.clientId)

    const form = forms[type]
    const resetValues: any = {
      ...(type !== ElementTypes.IMAGE && {
        fontSize: String((newElement as any).fontSize ?? 12),
      }),
      ...(type === ElementTypes.IMAGE && {
        width: (newElement as ImageElement).width,
        height: (newElement as ImageElement).height,
      }),
      startTime: String(newElement.startTime ?? 0),
      endTime: String(newElement.endTime ?? 0),
      borderColor: defaultElement.borderColor,
    }
    if (type === ElementTypes.TEXT) {
      resetValues.content = (newElement as TextElement).content
      resetValues.bgColor = (newElement as TextElement).bgColor
      resetValues.textColor = (newElement as TextElement).textColor
    } else if (type === ElementTypes.LINK) {
      resetValues.content = (newElement as LinkElement).content
      resetValues.url = (newElement as LinkElement).url
      resetValues.textColor = (newElement as TextElement).textColor
    } else if (type === ElementTypes.IMAGE) {
      resetValues.image = (newElement as ImageElement).image
    }

    form.reset(resetValues)
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
            ...(selectedElement.type !== ElementTypes.IMAGE &&
            'fontSize' in updatedElement
              ? {
                  fontSize: updatedElement.fontSize
                    ? Number(updatedElement.fontSize)
                    : selectedElement.fontSize,
                }
              : {}),
            width: updatedElement.width
              ? Number(updatedElement.width)
              : selectedElement.width,
            height: updatedElement.height
              ? Number(updatedElement.height)
              : selectedElement.height,
            borderWidth: updatedElement.borderWidth
              ? Number(updatedElement.borderWidth)
              : selectedElement.borderWidth,
            borderRadius: updatedElement.borderRadius
              ? Number(updatedElement.borderRadius)
              : selectedElement.borderRadius,
            endTime,
            startTime,
            type: selectedElement.type,
            position: selectedElement.position,
          } as TextElement | LinkElement | ImageElement
        }
        return el
      }),
    )
  }

  useEffect(() => {
    if (!selectedElement) return

    const type = selectedElement.type
    const watchFunction = {
      [ElementTypes.TEXT]: watchTextForm,
      [ElementTypes.LINK]: watchLinkForm,
      [ElementTypes.IMAGE]: watchImageForm,
    }[type] as any

    const subscription = watchFunction((data: any) => {
      const updates: any = {
        ...data,
        startTime: data.startTime
          ? Number(timeToSeconds(data.startTime))
          : undefined,
        endTime: data.endTime ? Number(timeToSeconds(data.endTime)) : undefined,
      }

      if (type !== ElementTypes.IMAGE) {
        updates.fontSize = data.fontSize ? Number(data.fontSize) : undefined
      }

      if (type === ElementTypes.IMAGE) {
        updates.image = data.image ? URL.createObjectURL(data.image) : undefined
      }

      updateElement(updates, selectedElement)
    })

    return () => subscription.unsubscribe()
  }, [selectedElement, watchTextForm, watchLinkForm, watchImageForm])

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
    if (!videoLink) return
    // Save elements to localStorage
    localStorage.setItem('previewElements', JSON.stringify(elements))
    // Save project details to localStorage
    const project = {
      projectName: 'Demo Project',
      videoUrl: videoLink,
    }
    localStorage.setItem('previewProject', JSON.stringify(project))

    // Navigate to preview page
    navigate({ to: '/preview' })
  }

  // check if localStorage has previewElements and load them
  useEffect(() => {
    const storedElements = localStorage.getItem('previewElements')
    const project = localStorage.getItem('previewProject')
    if (storedElements) {
      setElements(JSON.parse(storedElements))
    }

    if (project) {
      setVideoLink(JSON.parse(project).videoUrl)
    }
  }, [])

  const resetElements = () => {
    setElements([])
    setVideoLink('')
    localStorage.removeItem('previewElements')
    localStorage.removeItem('previewProject')
  }

  const deleteElement = (clientId?: string) => {
    if (!clientId) return
    const updatedElements = [...elements].filter(
      (el) => el.clientId !== clientId,
    )
    setElements(updatedElements)

    if (updatedElements.length > 0) {
      const nextElement = updatedElements?.at(updatedElements.length - 1)?.clientId
      setSelectedElementId(nextElement ?? '')
    } else {
      setSelectedElementId('')
    }
  }

  const handleVideoInputChange = (value: string) => {
    const httpsPattern = /^https:\/\/.*/
    if (httpsPattern.test(value)) {
      setVideoLink(value)
    }
  }

  return {
    textForm: forms[ElementTypes.TEXT],
    submitText: submitFunctions[ElementTypes.TEXT],
    linkForm: forms[ElementTypes.LINK],
    submitLink: submitFunctions[ElementTypes.LINK],
    imageForm: forms[ElementTypes.IMAGE],
    submitImage: submitFunctions[ElementTypes.IMAGE],
    addElement,
    containerRef,
    containerDimensions,
    elements,
    selectedElement,
    videoPlayerRef,
    handleElementSelect,
    setVideoDuration,
    handleDragEnd,
    handleNavigateToPreview,
    resetElements,
    deleteElement,
    handleVideoInputChange,
    videoLink,
  }
}
