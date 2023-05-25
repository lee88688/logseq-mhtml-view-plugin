import React, {useRef, useEffect, useState, useCallback, useDeferredValue, useMemo} from 'react'
import {Marker} from "@notelix/web-marker"
import { VerticalResizer } from './verticalResizer'
import { useViewerStore } from './store/viewer'
import { Toolbar } from './components/toolbar'
import {Editor} from "./editor";

export function Viewer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [isVerticalChange, setIsVerticalChange] = useState(false)

  const [editorVisible, setEditorVisible] = useState(false)
  const [editorPos, setEditorPos] = useState({ left: 0, top: 0 })
  
  const editorStyle = useMemo(() => {
    return {
      display: editorVisible ? 'block' : 'none',
      left: `${editorPos.left}px`,
      top: `${editorPos.top}px`,
    }
  }, [editorPos, editorVisible])

  const markerRef = useRef<Marker>()

  const iframeUrl = useViewerStore(state => {
    const parser = state.parser
    return parser && parser.parts && parser.parts[0].rewriteLocation
  })

  const createParser = useViewerStore(state => state.createParser)

  const mhtml = useDeferredValue(useViewerStore(state => state.content))

  const setEditorPosition = useCallback((range: Range) => {
    if (!iframeRef.current) return
    if (!range.toString()) {
      setEditorVisible(false)
      return
    }
    const iframeRect = iframeRef.current.getBoundingClientRect()
    const pos = range.getBoundingClientRect()

    setEditorPos({
      left: iframeRect.left + pos.left,
      top: iframeRect.top + pos.top + pos.height,
    })
    setEditorVisible(true)
  }, [])

  useEffect(() => {
    const createProcess = createParser(mhtml)

    return () => {
      createProcess.then(parser => {
        if (!parser) return

        for (const part of parser.parts) {
          part.rewriteLocation && URL.revokeObjectURL(part.rewriteLocation)
        }
      })
    }
  }, [createParser, mhtml])

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
              console.log('paintHL', context, element)
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
          setEditorPosition(range)
          // const serialized = markerRef.current.serializeRange(range)
          // markerRef.current.paint(serialized)
          // Marker.clearSelection()
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
  }, [iframeUrl, setEditorPosition])

  const handleVerticalSizeChange = useViewerStore(state => state.setViewerWidth)

  const handleVerticalSizeStart = useCallback(() => setIsVerticalChange(true), [])
  const handleVerticalSizeEnd = useCallback(() => setIsVerticalChange(false), [])

  return (
    <main
      id="mhtml-layout"
      className='mhtml-plugin__viewer'
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
      <div className='mhtml-plugin__toolbar-wrap'>
        <Toolbar/>
      </div>
      <div style={editorStyle} className='mhtml-plugin__editor-wrap'>
        <Editor />
      </div>
    </main>
  )
}