import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import Parser from '@monsterlee/fast-mhtml'
import { VerticalResizer } from './verticalResizer'

export type ViewerProps = {
  mhtml?: ArrayBuffer
}

export function Viewer(props: ViewerProps) {
  const [iframeUrl, setIframeUrl] = useState<string>()

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

  const preParserRef = useRef<Parser>()

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

  const handleVerticalSizeChange = useCallback((left: number) => {
    // const vw = Math.min(10, Math.max(left / window.innerWidth * 100, 80))
    const vw = left / window.innerWidth * 100
    document.documentElement.style.setProperty('--mhtml-view-container-width', `${vw}vw`)
  }, [])

  return (
    <main
      id="mhtml-layout" 
      className='container grow h-screen relative absolute left-0 top-0' 
      style={{ width: 'var(--mhtml-view-container-width, 50vw)'}}
    >
      <iframe className='w-full h-full'  src={iframeUrl}/>
      <VerticalResizer onChange={handleVerticalSizeChange}/>
    </main>
  )
}