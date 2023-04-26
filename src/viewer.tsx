import React, { useRef, useEffect, useState, useCallback, useDeferredValue } from 'react'
import Parser from '@monsterlee/fast-mhtml'
import {Marker} from "@notelix/web-marker"
import { VerticalResizer } from './verticalResizer'
import { useViewerStore } from './store/viewer'

export function Viewer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [isVerticalChange, setIsVerticalChange] = useState(false)

  const markerRef = useRef<Marker>()

  const iframeUrl = useViewerStore(state => {
    const parser = state.parser
    return parser && parser.parts && parser.parts[0].rewriteLocation
  })

  const createParser = useViewerStore(state => state.createParser)

  const mhtml = useDeferredValue(useViewerStore(state => state.content))

  useEffect(() => {
    const createProces = createParser(mhtml)

    return () => {
      createProces.then(parser => {
        if (!parser) return

        for (const part of parser.parts) {
          part.rewriteLocation && URL.revokeObjectURL(part.rewriteLocation)
        }
      })
    }
  }, [mhtml])

  useEffect(() => {
    let removeCallback: undefined | (() => void)
    if (iframeUrl && iframeRef.current) {
      iframeRef.current.onload = () => {
        const contentWindow = iframeRef.current?.contentWindow!

        markerRef.current = new Marker({
          rootElement: contentWindow.document.body,
          eventHandler: {},
          highlightPainter: {
            paintHighlight: (context, element) => {
              element.style.textDecoration = "underline";
              element.style.textDecorationColor = "#f6b80b";
              if (context.serializedRange.annotation) {
                element.style.backgroundColor = "rgba(246,184,11, 0.3)";
              } else {
                element.style.backgroundColor = "initial";
              }
            }
          }
        })
  
        console.log(markerRef)
  
        markerRef.current.addEventListeners()
  
        const mousemove = (e: MouseEvent) => {
          // const { pageX, pageY } = e;
          // contentWindow.pointerPos = { x: pageX, y: pageY };
        }
  
        const mouseup = (e: MouseEvent) => {
          const selection = contentWindow.getSelection();
          if (!selection) return;
          const range = selection.getRangeAt(0);
          // this will always be null, because of web-marker's bug
          const serialized = markerRef.current.serializeRange(range)
          markerRef.current.paint(serialized)
          Marker.clearSelection()
        }
  
        contentWindow.addEventListener('mouseup', mouseup)
        contentWindow.addEventListener('pointermove', mousemove)

        removeCallback = () => {
          markerRef.current.removeEventListeners()
          contentWindow?.removeEventListener('mouseup', mouseup)
          contentWindow?.removeEventListener('pointermove', mousemove)
        }
      }

      return () => {
        removeCallback?.()
      }
    }
  }, [iframeUrl])

  const handleVerticalSizeChange = useViewerStore(state => state.setViewerWidth)

  const handleVerticalSizeStart = useCallback(() => setIsVerticalChange(true), [])
  const handleVerticalSizeEnd = useCallback(() => setIsVerticalChange(false), [])

  return (
    <main
      id="mhtml-layout"
      className='container grow h-screen absolute left-0 top-0'
      style={{ width: 'var(--mhtml-view-container-width, 50vw)'}}
    >
      <iframe 
        ref={iframeRef}
        className='w-full h-full'  
        src={iframeUrl} style={{ pointerEvents: isVerticalChange ? 'none' : 'auto' }}
      />
      <VerticalResizer
        onChange={handleVerticalSizeChange}
        onStart={handleVerticalSizeStart}
        onEnd={handleVerticalSizeEnd}
      />
    </main>
  )
}