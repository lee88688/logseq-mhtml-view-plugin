import { LSPluginUserEvents } from '@logseq/libs/dist/LSPlugin.user'
import { BlockCommandCallback } from '@logseq/libs/dist/LSPlugin'
import React from 'react'
import { Mark, useViewerStore } from './store/viewer'
import { LOGSEQ_APP_CONTAINER_ID, MHTML_CONTAINER_ID } from './constant'

interface LogseqModelEvent {
  id: string
  type: string
  dataset: Record<string, string>
}

let _visible = logseq.isMainUIVisible

function subscribeLogseqEvent<T extends LSPluginUserEvents>(
  eventName: T,
  handler: (...args: any) => void
) {
  logseq.on(eventName, handler)
  return () => {
    logseq.off(eventName, handler)
  }
}

const subscribeToUIVisible = (onChange: () => void) =>
  subscribeLogseqEvent('ui:visible:changed', ({ visible }) => {
    _visible = visible
    onChange()
  })

export const useAppVisible = () => {
  return React.useSyncExternalStore(subscribeToUIVisible, () => _visible)
}

function getPersistStr(pageName: string, marks: Mark[]) {
  return JSON.stringify({ pageName, marks })
}

export function persistToStorage(pageName: string, marks: Mark[]) {
  const content = getPersistStr(pageName, marks)
  const storage = logseq.Assets.makeSandboxStorage()
  return storage.setItem(`${pageName}.json`, content)
}

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
      const name = fileName.split('.')[0]
      await storage.setItem(`${name}.json`, getPersistStr(name, []))
      await logseq.Editor.createPage(name, {}, { redirect: false })
      await logseq.Editor.insertAtEditingCursor(
        `{{renderer :mhtml, ${fileName}}}`
      )
      resolve()
    })
    // todo: when user not select file will reject too.

    input.click()
  })
}

export async function openMhtmlFile(e: LogseqModelEvent) {
  const fileName = e.dataset.filename
  if (!fileName) return

  const storage = logseq.Assets.makeSandboxStorage()
  const hasFile = await storage.hasItem(fileName)
  if (!hasFile) return

  const content = await storage.getItem(fileName)
  if (!content) return

  const name = fileName.split('.')[0]
  const configContent = await storage.getItem(`${name}.json`)
  if (!configContent) return
  const config = JSON.parse(configContent)
  useViewerStore.setState({ pageName: config.pageName, marks: config.marks })

  // change app container view
  const top = window.top
  const element = top?.document.getElementById(LOGSEQ_APP_CONTAINER_ID)
  if (!element) return
  element.style.marginLeft = `var(--mhtml-view-container-width, 50vw)`
  logseq.App.setLeftSidebarVisible(false)
  logseq.App.setRightSidebarVisible(false)

  useViewerStore.getState().openFile(fileName, content)
}

export async function closeMhtmlFile() {
  const top = window.top
  const element = top?.document.getElementById(LOGSEQ_APP_CONTAINER_ID)
  element?.style.removeProperty('margin-left')
  useViewerStore.setState({ visible: false })
}

export async function startSetup() {
  // create anchor element
  const top = window.top
  if (!top) {
    // todo: show error
    return
  }

  const div = top.document.createElement('div')
  div.id = MHTML_CONTAINER_ID

  const appContainer = top.document.getElementById(LOGSEQ_APP_CONTAINER_ID)
  appContainer?.appendChild(div)
}
