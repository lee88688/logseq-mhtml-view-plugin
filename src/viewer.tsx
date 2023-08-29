import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Marker } from '@notelix/web-marker'
import { VerticalResizer } from './verticalResizer'
import { Mark, SerializedRange, useViewerStore } from './store/viewer'
import { Toolbar, ToolbarItemType } from './components/toolbar'
import { ColorMap, Editor, EditorContent, HighlightColor } from './editor'

const EDITOR_HEIGHT = 64

const getPos = (pos: DOMRect, iframeRec: DOMRect) => {
  if (pos.bottom + EDITOR_HEIGHT > iframeRec.bottom)
    return {
      left: iframeRec.left + pos.left,
      top: pos.top - EDITOR_HEIGHT
    }
  return {
    left: iframeRec.left + pos.left,
    top: iframeRec.top + pos.top + pos.height
  }
}

export function Viewer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [isVerticalChange, setIsVerticalChange] = useState(false)

  const [editorVisible, setEditorVisible] = useState(false)
  const [editorPos, setEditorPos] = useState({ left: 0, top: 0 })
  const [selected, setSelected] = useState('')
  const [curPosition, setCurPosition] = useState<SerializedRange>()

  const mark = useViewerStore((state) =>
    state.marks.find((item) => item.id === selected)
  )

  const editorStyle = useMemo(() => {
    return {
      display: editorVisible ? 'block' : 'none',
      left: `${editorPos.left}px`,
      top: `${editorPos.top}px`
    }
  }, [editorPos, editorVisible])

  const markerRef = useRef<Marker>()

  const iframeUrl = useViewerStore((state) => {
    const parser = state.parser
    return parser?.getUrl()
  })

  const createParser = useViewerStore((state) => state.createParser)

  const mhtml = useDeferredValue(useViewerStore((state) => state.content))

  const setEditorPosition = useCallback((range: Range) => {
    if (!iframeRef.current) return
    if (!range.toString()) {
      setEditorVisible(false)
      return
    }
    const iframeRect = iframeRef.current.getBoundingClientRect()
    const pos = range.getBoundingClientRect()

    setEditorPos(getPos(pos, iframeRect))
    setEditorVisible(true)
    setCurPosition(markerRef.current.serializeRange(range))
  }, [])

  useEffect(() => {
    const createProcess = createParser()

    return () => {
      createProcess.then((parser) => {
        if (!parser) return

        parser.destroy()
      })
    }
  }, [createParser, mhtml])

  useEffect(() => {
    let removeCallback: undefined | (() => void)
    if (iframeUrl && iframeRef.current) {
      iframeRef.current.onload = () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        const contentWindow = iframeRef.current?.contentWindow!

        markerRef.current = new Marker({
          rootElement: contentWindow.document.body,
          eventHandler: {
            onHighlightClick(context, element: HTMLElement) {
              if (!useViewerStore.getState().isHighlightActive()) return
              const iframeRect = iframeRef.current?.getBoundingClientRect()
              if (!iframeRect) return

              const pos = element.getBoundingClientRect()
              const id = element.getAttribute('highlight-id')
              if (!id) return

              setEditorPos(getPos(pos, iframeRect))
              setEditorVisible(true)
              setSelected(id)
            }
          },
          highlightPainter: {
            paintHighlight: (context, element: HTMLElement) => {
              console.log('paintHL', context, element)
              const getMark = useViewerStore.getState().getMark
              const mark = getMark(context.serializedRange.uid)
              if (!mark) return

              const color = ColorMap[mark.color]
              if (mark.underline) {
                element.style.textDecoration = 'underline'
                element.style.textDecorationColor = color
                element.style.textDecorationThickness = '2px'
                element.style.backgroundColor = 'initial'
              } else {
                element.style.textDecoration = 'initial'
                element.style.backgroundColor = color
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
          if (!useViewerStore.getState().isHighlightActive()) return
          setSelected('')
          const selection = contentWindow.getSelection()
          if (!selection) return
          const range = selection.getRangeAt(0)
          setEditorPosition(range)
        }

        contentWindow.addEventListener('mouseup', mouseup)
        contentWindow.addEventListener('pointermove', mousemove)

        removeCallback = () => {
          markerRef.current.removeEventListeners()
          contentWindow?.removeEventListener('mouseup', mouseup)
          contentWindow?.removeEventListener('pointermove', mousemove)
        }

        // add marks to iframe
        useViewerStore
          .getState()
          .marks.forEach((item) => markerRef.current.paint(item.position))
      }

      return () => {
        removeCallback?.()
      }
    }
  }, [iframeUrl, setEditorPosition])

  const handleEditorChange = useCallback(
    async (content: EditorContent) => {
      if (!mark) {
        const pageName = useViewerStore.getState().pageName
        if (!curPosition || !pageName) return
        // create new mark
        const mark: Mark = {
          id: '',
          color: content.color ?? HighlightColor.Yellow,
          underline: content.underline ?? false,
          comment: content.comment ?? '',
          position: curPosition
        }

        // create logseq block
        const id = await useViewerStore.getState().addMark(mark)
        setSelected(id)
        Marker.clearSelection(markerRef.current.window)
        markerRef.current.paint(curPosition)
      } else if (content.color === HighlightColor.None) {
        await useViewerStore.getState().removeMark(mark.id)
        setSelected('')
        setEditorVisible(false)
        markerRef.current.unpaint(mark.position)
      } else {
        useViewerStore.getState().updateMark(mark.id, content)
        if (!content.comment) {
          markerRef.current.unpaint(mark.position)
          const newMark = useViewerStore.getState().getMark(mark.id)
          newMark && markerRef.current.paint(newMark.position)
        }
      }
    },
    [curPosition, mark]
  )

  const handleVerticalSizeChange = useViewerStore(
    (state) => state.setViewerWidth
  )

  const handleVerticalSizeStart = useCallback(
    () => setIsVerticalChange(true),
    []
  )
  const handleVerticalSizeEnd = useCallback(
    () => setIsVerticalChange(false),
    []
  )

  const persistConfig = useViewerStore((state) => state.persistConfig)
  const deferredMarks = useDeferredValue(useViewerStore((state) => state.marks))

  useEffect(() => {
    persistConfig()
  }, [persistConfig, deferredMarks])

  return (
    <main
      id="mhtml-layout"
      className="mhtml-plugin__viewer"
      style={{ width: 'var(--mhtml-view-container-width, 50vw)' }}
    >
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        style={{ pointerEvents: isVerticalChange ? 'none' : 'auto' }}
      />
      <VerticalResizer
        onChange={handleVerticalSizeChange}
        onStart={handleVerticalSizeStart}
        onEnd={handleVerticalSizeEnd}
      />
      <div className="mhtml-plugin__toolbar-wrap">
        <Toolbar />
      </div>
      <div style={editorStyle} className="mhtml-plugin__editor-wrap">
        <Editor
          color={mark?.color}
          underline={mark?.underline}
          comment={mark?.comment}
          onChange={handleEditorChange}
        />
      </div>
    </main>
  )
}
