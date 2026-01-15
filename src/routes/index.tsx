import { createFileRoute, redirect } from '@tanstack/react-router'
import { Stage, Layer } from 'react-konva'
import { Text as TextComponent } from './-components/Text'
import { Link as LinkComponent } from './-components/Link'
import { Image as ImageComponent } from './-components/Image'
import { Button } from '@/components/ui/button'
import { ElementTypes } from '@/_shared/constants'
import { TypeIcon, LinkIcon, ImageIcon, TrashIcon } from 'lucide-react'
import { BoardMenu } from './-components/BoardMenu'
import { useVideoBoard } from './-hooks/useVideoBoard'
import { Form } from '@/components/ui/form'
import GenericFormInputs from '@/components/GenericFormInputs'
import { linkInputs, textInputs, imageInputs } from './-hooks/helpers'
import ReactPlayer from 'react-player'
import Header from '@/components/Header'
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
import { Input } from '@/components/ui/input'
import { EmptyComp } from './-components/Empty'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw redirect({
        to: '/login',
        search: {},
      })
    }
  },
  component: App,
})

function App() {
  const {
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
    handleElementSelect,
    setVideoDuration,
    handleDragEnd,
    handleNavigateToPreview,
    resetElements,
    deleteElement,
    handleVideoInputChange,
    videoLink,
  } = useVideoBoard()

  return (
    <div className="w-screen h-screen bg-white">
      <Header />
      <div className="py-5 container mx-auto flex justify-between items-center space-x-5">
        <div className="basis-2/5">
          <Input
            name="videoLink"
            placeholder="enter a youtube link"
            value={videoLink}
            type="url"
            pattern="https://.*"
            className="h-14"
            onChange={(e) => handleVideoInputChange(e.currentTarget.value)}
          />
        </div>
        <div className="space-x-5">
          <Button onClick={() => handleNavigateToPreview()}>Preview</Button>
          <Button onClick={resetElements}>Reset Anontations</Button>
        </div>
      </div>

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
          <div className="w-full h-[80%] relative bg-amber-400">
            {!videoLink ? (
              <div className={cn('w-full z-10 absolute h-full')}>
                <EmptyComp
                  videoInput={
                    <Input
                      name="videoLink"
                      placeholder="enter a youtube link"
                      value={videoLink}
                      type="url"
                      pattern="https://.*"
                      className="h-14"
                      onChange={(e) =>
                        handleVideoInputChange(e.currentTarget.value)
                      }
                    />
                  }
                />
              </div>
            ) : (
              <div
                ref={containerRef}
                className={cn('w-full z-10 absolute', 'h-[90%]')}
              >
                <Stage
                  width={containerDimensions.width}
                  height={containerDimensions.height}
                >
                  <Layer>
                    {elements.map((element) => {
                      if (element.type === ElementTypes.TEXT) {
                        return (
                          <TextComponent
                            onClick={() =>
                              handleElementSelect(element.clientId)
                            }
                            key={element.clientId}
                            {...element}
                            onDragEnd={(e) => {
                              if (!element.clientId) return

                              handleDragEnd({
                                clientId: element.clientId,
                                x: e.target.x(),
                                y: e.target.y(),
                              })
                            }}
                          />
                        )
                      }
                      if (element.type === ElementTypes.LINK) {
                        return (
                          <LinkComponent
                            onClick={() =>
                              handleElementSelect(element.clientId)
                            }
                            key={element.clientId}
                            {...element}
                            onDragEnd={(e) => {
                              if (!element.clientId) return

                              handleDragEnd({
                                clientId: element.clientId,
                                x: e.target.x(),
                                y: e.target.y(),
                              })
                            }}
                          />
                        )
                      }
                      if (element.type === ElementTypes.IMAGE) {
                        console.log(element)
                        return (
                          <ImageComponent
                            onClick={() =>
                              handleElementSelect(element.clientId)
                            }
                            key={element.clientId}
                            {...element}
                            onDragEnd={(e) => {
                              if (!element.clientId) return

                              handleDragEnd({
                                clientId: element.clientId,
                                x: e.target.x(),
                                y: e.target.y(),
                              })
                            }}
                          />
                        )
                      }
                    })}
                  </Layer>
                </Stage>
              </div>
            )}

            <MediaController
              style={{
                width: '100%',
                aspectRatio: '16/9',
              }}
            >
              <ReactPlayer
                //  ref={videoPlayerRef}
                //"https://youtu.be/2Z1oKtxleb4?si=5YQnp50-f5MA5PuA"
                slot="media"
                src={videoLink}
                controls={false}
                style={{
                  width: '100%',
                  height: '100%',
                  // '--controls': 'none',
                }}
                onDurationChange={(duration) => {
                  setVideoDuration(duration.currentTarget.duration)
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
        </div>
        <div className="col-span-3 h-full border-l border-gray-200 overflow-hidden">
          {selectedElement?.clientId && (
            <div className="w-full py-2 border-b border-gray-200">
              <BoardMenu
                onClick={() => deleteElement(selectedElement?.clientId)}
                icon={<TrashIcon className="size-4" />}
                text="Delete"
              />
            </div>
          )}
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
                </form>
              </Form>
            )}

            {selectedElement?.type === ElementTypes.IMAGE && (
              <Form {...imageForm}>
                <form
                  onSubmit={imageForm.handleSubmit(submitImage)}
                  className="space-y-5"
                >
                  <div className="space-y-5">
                    {imageInputs.map((input, idx) => {
                      return (
                        <GenericFormInputs
                          key={`${input.name}-${idx}`}
                          {...input}
                          form={imageForm}
                        />
                      )
                    })}
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
