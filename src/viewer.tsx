import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import Parser from '@monsterlee/fast-mhtml'
import {Marker} from "@notelix/web-marker"
import { VerticalResizer } from './verticalResizer'

export type ViewerProps = {
  mhtml?: ArrayBuffer
}

export function Viewer(props: ViewerProps) {
  const [iframeUrl, setIframeUrl] = useState<string>()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [isVerticalChange, setIsVerticalChange] = useState(false)

  const preParserRef = useRef<Parser>()

  const markerRef = useRef<Marker>()

  const parser = useMemo(() => {
    if (!props.mhtml) return;

    const parser = new Parser({
      rewriteFn(url, part) {
        let blob = new Blob([part.body], { type: part.type })
        ;(part as any)._blob = blob
        return URL.createObjectURL(blob)
      }
    })
    return parser
  }, [props.mhtml])

  useEffect(() => {
    if (parser) {
      if (preParserRef.current) {
        for (let part of preParserRef.current.parts) {
          part.rewriteLocation && URL.revokeObjectURL(part.rewriteLocation)
        }
      }

      parser.parse(props.mhtml as any)
      parser.rewrite()
      setIframeUrl(parser && parser.parts && parser.parts[0].rewriteLocation)

      preParserRef.current = parser
    }
  }, [parser])

  let contentWindow: Window | undefined
  let mousemove: any
  let mouseup: any

  useEffect(() => {
    if (iframeUrl && iframeRef.current) {
      iframeRef.current.onload = () => {
        contentWindow = iframeRef.current.contentWindow!

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
  
        mousemove = (e: MouseEvent) => {
          const { pageX, pageY } = e;
          contentWindow.pointerPos = { x: pageX, y: pageY };
        }
  
        mouseup = (e: MouseEvent) => {
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
      }

      return () => {
        markerRef.current.removeEventListeners()
        contentWindow?.removeEventListener('mouseup', mouseup)
        contentWindow?.removeEventListener('pointermove', mousemove)
      }
    }
  }, [iframeUrl])

  const handleVerticalSizeChange = useCallback((left: number) => {
    // const vw = Math.min(10, Math.max(left / window.innerWidth * 100, 80))
    const vw = left / window.innerWidth * 100
    document.documentElement.style.setProperty('--mhtml-view-container-width', `${vw}vw`)
  }, [])

  const handleVerticalSizeStart = useCallback(() => setIsVerticalChange(true), [])
  const handleVerticalSizeEnd = useCallback(() => setIsVerticalChange(false), [])

  return (
    <main
      id="mhtml-layout"
      className='container grow h-screen relative absolute left-0 top-0'
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