import React, { useRef } from "react";
import { useAppVisible } from "./utils";
import { Editor } from "./editor";

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();
  if (visible) {
    return (
      <main
        className="backdrop-filter backdrop-blur-md fixed inset-0 flex flex-col items-center justify-center"
        onClick={(e) => {
          if (!innerRef.current?.contains(e.target as any)) {
            window.logseq.hideMainUI();
          }
        }}
      >
        <div ref={innerRef} className="text-size-2em">
          Welcome to [[Logseq]] Plugins!
        </div>
        <Editor/>
      </main>
    );
  }
  return null;
}

export default App;
