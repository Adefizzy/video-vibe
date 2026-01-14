import { createFileRoute } from '@tanstack/react-router'
import { Stage, Layer } from 'react-konva'
import { Text as TextComponent } from './-components/Text'
import { Link as LinkComponent } from './-components/Link'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'
import { ElementTypes } from '@/_shared/constants'
import { TypeIcon, LinkIcon, ImageIcon, TrashIcon } from 'lucide-react'
import { BoardMenu } from './-components/BoardMenu'
import { useVideoBoard } from './-hooks/useVideoBoard'
import { Form } from '@/components/ui/form'
import GenericFormInputs from '@/components/GenericFormInputs'
import { linkInputs, textInputs } from './-hooks/helpers'
import ReactPlayer from 'react-player'
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from 'media-chrome/react'

export const Route = createFileRoute('/')({
  component: App,
})

/*  <Text
                  text={text1}
                  fontSize={26} 
                  fontFamily="Calibri"
                  textColor="#fff"
                  padding={40}
                  align="center"
                  width={300}
                  //borderRadius={10}
                  borderWidth={1}
                  borderColor="#555"
                  bgColor="black"
                /> */

function App() {
  const {
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
  } = useVideoBoard()

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-12 container mx-auto h-[80vh] border border-gray-200 rounded-lg">
        <div className="col-span-9 h-full px-5  ">
          <div className="w-full py-2 border-b border-gray-200">
            <BoardMenu
              onClick={() => addElement(ElementTypes.TEXT)}
              icon={<TypeIcon className="size-4" />}
              text="Text"
            />
            <BoardMenu
              onClick={() => addElement(ElementTypes.LINK)}
              icon={<LinkIcon className="size-4" />}
              text="Link"
            />
            <BoardMenu
              onClick={() => addElement(ElementTypes.IMAGE)}
              icon={<ImageIcon className="size-4" />}
              text="Image"
            />
          </div>
          <div className="w-full h-[80%] bg-red-400 relative">
            <div ref={containerRef} className="w-full h-[95%] z-50 absolute">
              <Stage
                width={containerDimensions.width}
                height={containerDimensions.height}
              >
                <Layer>
                  {elements.map((element) => {
                    if (element.type === ElementTypes.TEXT) {
                      return (
                        <TextComponent key={element.clientId} {...element} />
                      )
                    }
                    if (element.type === ElementTypes.LINK) {
                      return (
                        <LinkComponent key={element.clientId} {...element} />
                      )
                    }
                  })}
                </Layer>
              </Stage>
            </div>
            <MediaController
              style={{
                width: '100%',
                aspectRatio: '16/9',
              }}
            >
              <ReactPlayer
              //  ref={videoPlayerRef}
                slot="media"
                src="https://youtu.be/2Z1oKtxleb4?si=5YQnp50-f5MA5PuA"
                controls={false}
                style={{
                  width: '100%',
                  height: '100%',
                  '--controls': 'none',
                }}
                onDurationChange={(duration) => {
                  console.log('Video duration:', duration.currentTarget.duration)
                }}
                onDuration={(duration: any) => {
                  console.log('Video duration2:', duration)
                  //setVideoDuration(duration)
                }}
              ></ReactPlayer>
              <MediaControlBar>
                <MediaPlayButton />
                <MediaSeekBackwardButton seekOffset={10} />
                <MediaSeekForwardButton seekOffset={10} />
                <MediaTimeRange />
                <MediaTimeDisplay showDuration />
                <MediaMuteButton />
                <MediaVolumeRange />
                <MediaPlaybackRateButton />
                <MediaFullscreenButton />
              </MediaControlBar>
            </MediaController>
          </div>
          {/*     <div className="w-full h-[80%] bg-amber-500 ">
            <MediaController
              style={{
                width: '100%',
                aspectRatio: '16/9',
              }}
            >
              <ReactPlayer
                slot="media"
                src="https://stream.mux.com/maVbJv2GSYNRgS02kPXOOGdJMWGU1mkA019ZUjYE7VU7k"
                controls={false}
                style={{
                  width: '100%',
                  height: '100%',
                  '--controls': 'none',
                }}
              ></ReactPlayer>
              <MediaControlBar>
                <MediaPlayButton />
                <MediaSeekBackwardButton seekOffset={10} />
                <MediaSeekForwardButton seekOffset={10} />
                <MediaTimeRange />
                <MediaTimeDisplay showDuration />
                <MediaMuteButton />
                <MediaVolumeRange />
                <MediaPlaybackRateButton />
                <MediaFullscreenButton />
              </MediaControlBar>
            </MediaController>
          </div> */}
        </div>
        <div className="col-span-3 h-full border-l border-gray-200 overflow-hidden">
          <div className="w-full py-2 border-b border-gray-200">
            <BoardMenu
              onClick={() => {}}
              icon={<TrashIcon className="size-4" />}
              text="Delete"
            />
          </div>
          <div className="w-full p-2 space-y-5 overflow-auto max-h-[90%] h-[90%]">
            {selectedElement?.type === ElementTypes.TEXT && (
              <Form {...textForm}>
                <form
                  onSubmit={textForm.handleSubmit(submitText)}
                  className="space-y-5"
                >
                  <div className="space-y-5">
                    {textInputs.map((input, idx) => {
                      return (
                        <GenericFormInputs
                          key={`${input.name}-${idx}`}
                          {...input}
                          form={textForm}
                        />
                      )
                    })}
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Save
                  </Button>
                </form>
              </Form>
            )}

            {selectedElement?.type === ElementTypes.LINK && (
              <Form {...linkForm}>
                <form
                  onSubmit={linkForm.handleSubmit(submitLink)}
                  className="space-y-5"
                >
                  <div className="space-y-5">
                    {linkInputs.map((input, idx) => {
                      return (
                        <GenericFormInputs
                          key={`${input.name}-${idx}`}
                          {...input}
                          form={linkForm}
                        />
                      )
                    })}
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Save
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
