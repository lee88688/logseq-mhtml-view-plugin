import React, { useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom'
import { useAppVisible } from "./utils";
import { Editor } from "./editor";
import { Viewer } from "./viewer";

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();

  const [file, setFile] = useState<ArrayBuffer>()

  const portalEl = useRef<HTMLDivElement>()

  useEffect(() => {
    const div = document.getElementById('mhtml-container') as HTMLDivElement | null
    div && (portalEl.current = div)
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
        style={{ marginLeft: 'calc(100vw - var(--mhtml-view-container-width, 50vw))' }}
        onClick={(e) => {
          if (!innerRef.current?.contains(e.target as any)) {
            window.logseq.hideMainUI();
          }
        }}
      >
        <div ref={innerRef} className="text-size-2em">
          Welcome to [[Logseq]] Plugins!
          <input type='file' onChange={handleFileChange}/>
        </div>
        {portalEl.current && createPortal(<Viewer mhtml={file}/>, portalEl.current)}
      </main>
    );
  }
  return null;
}

export default App;
