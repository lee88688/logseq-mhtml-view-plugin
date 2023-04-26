import React, { useEffect, useState } from "react";
import { createPortal } from 'react-dom'
import { useAppVisible } from "./utils";
import { Editor } from "./editor";
import { Viewer } from "./viewer";
import { useViewerStore } from "./store/viewer";

function App() {
  const visible = useViewerStore(state => state.visible)

  const [portalEl, setPortalEl] = useState<HTMLElement>()

  useEffect(() => {
    const div = document.getElementById('mhtml-container') as HTMLDivElement | null
    div && setPortalEl(div)
  }, [])

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
