import React, { useEffect, useState } from "react";
import { createPortal } from 'react-dom'
import { Editor } from "./editor";
import { Viewer } from "./viewer";
import { useViewerStore } from "./store/viewer";
import { MHTML_CONTAINER_ID } from "./constant";

function App() {
  const visible = useViewerStore(state => state.visible)

  const [portalEl, setPortalEl] = useState<HTMLElement>()

  useEffect(() => {
    if (visible) {
      let div: HTMLElement | null | undefined
      if (import.meta.env.VITE_IS_MOCK)
        div = document.getElementById(MHTML_CONTAINER_ID) as HTMLDivElement | null
      else {
        div = window.top?.document.getElementById(MHTML_CONTAINER_ID)
        console.log('div', div)
      }
      div && setPortalEl(div)
    }
  }, [visible])

  const openFile = useViewerStore(state => state.openFile)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    console.log(input)
    const file = input.files?.[0]
    if (!file) return

    const content = await file.arrayBuffer()
    const fileName = file.name
    openFile(fileName, content)
  }

  if (visible) {
    return (
      <main
        className="backdrop-filter backdrop-blur-md fixed inset-0 flex flex-col items-center justify-center"
        style={{ marginLeft: 'var(--mhtml-view-container-width, 50vw)' }}
      >
        <div className="text-size-2em">
          <input type='file' onChange={handleFileChange}/>
        </div>
        {portalEl && createPortal(<Viewer/>, portalEl)}
      </main>
    );
  }
  return null;
}

export default App;
