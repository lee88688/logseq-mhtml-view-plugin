import React, { useCallback, useEffect, useRef } from 'react'

export interface VerticalResizerProps {
  onChange?: (left: number) => void
  onStart?: () => void
  onEnd?: () => void
}

export function VerticalResizer(props: VerticalResizerProps) {
  const { onEnd, onStart, onChange } = props

  const onChangeRef = useRef(props.onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    console.log(e)
    if (e.movementX === 0) return
    onChangeRef.current?.(e.clientX)
    e.preventDefault()
  }, [])

  const handleMouseUp = useCallback(() => {
    window.top?.removeEventListener('mousemove', handleMouseMove)
    onEnd?.()
  }, [handleMouseMove, onEnd])

  useEffect(() => {
    window.top?.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.top?.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseUp])

  return (
    <div
      className="mhtml-plugin__vertical-resizer"
      onMouseDown={(e) => {
        window.top?.addEventListener('mousemove', handleMouseMove)
        onStart?.()
      }}
    />
  )
}
