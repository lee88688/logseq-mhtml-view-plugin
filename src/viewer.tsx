import React, { useRef, useMemo, useEffect, useState } from 'react'
import Parser from '@monsterlee/fast-mhtml'

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

  return (
    <main className='container grow'>
      <iframe className='w-full h-full' src={iframeUrl}/>
    </main>
  )
}