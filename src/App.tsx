import React, { useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom'
import { useAppVisible } from "./utils";
import { Editor } from "./editor";
import { Viewer } from "./viewer";

function App() {
  const visible = useAppVisible();

  const [file, setFile] = useState<ArrayBuffer>()
  const [portalEl, setPortalEl] = useState<HTMLElement>()

  useEffect(() => {
    const div = document.getElementById('mhtml-container') as HTMLDivElement | null
    div && setPortalEl(div)
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    console.log(input)
    const file = await input.files?.[0].arrayBuffer()
    setFile(file)
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
        {portalEl && createPortal(<Viewer mhtml={file}/>, portalEl)}
      </main>
    );
  }
  return null;
}

export default App;
