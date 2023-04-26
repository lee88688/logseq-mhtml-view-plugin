import { LSPluginUserEvents } from "@logseq/libs/dist/LSPlugin.user";
import {BlockCommandCallback} from '@logseq/libs/dist/LSPlugin'
import React from "react";
import { useViewerStore } from "./store/viewer";

let _visible = logseq.isMainUIVisible;

function subscribeLogseqEvent<T extends LSPluginUserEvents>(
  eventName: T,
  handler: (...args: any) => void
) {
  logseq.on(eventName, handler);
  return () => {
    logseq.off(eventName, handler);
  };
}

const subscribeToUIVisible = (onChange: () => void) =>
  subscribeLogseqEvent("ui:visible:changed", ({ visible }) => {
    _visible = visible;
    onChange();
  });

export const useAppVisible = () => {
  return React.useSyncExternalStore(subscribeToUIVisible, () => _visible);
};

function isValidFileName(name: string) {
  return /\.(mhtml|html)/i.test(name)
}

export const importFile: BlockCommandCallback = async (event) => {
  const storage = logseq.Assets.makeSandboxStorage()
  const input = document.createElement('input')
  input.type = 'file'
  return new Promise<void>((resolve, reject) => {
    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      if (!file || !isValidFileName(file.name)) {
        reject()
        return
      }
      const fileName = file.name
      const hasFile = await storage.hasItem(fileName)
      if (hasFile) {
        logseq.UI.showMsg('file name already exists!')
        reject()
        return
      }
      const content = await file.text()
      await storage.setItem(fileName, content)
      await logseq.Editor.insertAtEditingCursor(`{{ renderer :mhtml, ${fileName} }}`)
      resolve()
    })
    // todo: when user not select file will reject too.

    input.click()
  })
}

export async function openMhtmlFile(e: MouseEvent) {
  const fileName = (e.target as HTMLElement).dataset.filename
  if (!fileName) return

  const storage = logseq.Assets.makeSandboxStorage()
  const hasFile = await storage.hasItem(fileName)
  if (!hasFile) return

  const content = await storage.getItem(fileName)
  if (!content) return
  
  useViewerStore.getState().openFile(fileName, content)
}
