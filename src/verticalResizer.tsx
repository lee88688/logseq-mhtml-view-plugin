import React, { useCallback, useEffect, useRef } from 'react'

export interface VerticalResizerProps {
  onChange?: (left: number) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export function VerticalResizer(props: VerticalResizerProps) {
  const onChangeRef = useRef(props.onChange)
  useEffect(() => {
    onChangeRef.current = props.onChange
  }, [props.onChange])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    console.log(e)
    if (e.movementX === 0) return;
    onChangeRef.current?.(e.clientX);
    e.preventDefault();
  }, [])

  const handleMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    props.onEnd?.()
  }, [handleMouseMove])

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseUp])

  return (
    <div
      className='absolute h-screen cursor-col-resize w-0.5 right-0 top-0'
      onMouseDown={e => {
        window.addEventListener('mousemove', handleMouseMove)
        props.onStart?.()
      }}
    />
  )
}