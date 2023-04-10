import React, { useRef } from 'react'
import Parser from '@monsterlee/fast-mhtml'

export type ViewerProps = {
  mhtml?: ArrayBuffer
}

export function Viewer(props: ViewerProps) {
  return (
    <main className='container grow'>
      <iframe className='w-full h-full'/>
    </main>
  )
}