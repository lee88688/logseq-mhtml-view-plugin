import Parser from '@monsterlee/fast-mhtml'
import { create } from 'zustand'
import { Marker } from '@notelix/web-marker'
import { FileType } from '../constant'
import { EditorContent, HighlightColor } from '../editor'
import { closeMhtmlFile, persistToStorage } from '../utils'

export interface SerializedRange {
  uid: string
  textBefore: string
  text: string
  textAfter: string
}

export interface Mark {
  id: string
  color: HighlightColor
  underline: boolean
  comment: string
  position: SerializedRange
}

interface ViewerSetting {
  scale: string
  width: string
  highlightMode: boolean
}

interface ViewerState {
  type: FileType
  visible: boolean
  content?: string | ArrayBuffer
  viewerSetting: ViewerSetting
  fileName: string
  marks: Mark[]
  parser?: Parser
  marker?: Marker
  pageName: string

  setViewerWidth: (left: number) => void
  toggleHighlightMode: () => void
  isHighlightActive: () => boolean
  createParser: (mhtml?: string | ArrayBuffer) => Promise<Parser | undefined>
  openFile: (fileName: string, content: string | ArrayBuffer) => Promise<void>
  getMark(id: string): Mark | undefined
  addMark: (mark: Mark) => Promise<string>
  removeMark: (id: string) => Promise<void>
  updateMark: (id: string, content: EditorContent) => void
  persistConfig: () => Promise<void>
  close: () => void
  gotoAnnotationPage: () => Promise<void>
}

export const useViewerStore = create<ViewerState>()((set, get) => ({
  type: FileType.MHTML,
  visible: false,
  viewerSetting: {
    scale: '100%',
    width: '50vw',
    highlightMode: false
  },
  fileName: '',
  pageName: '',
  marks: [],

  setViewerWidth(left: number) {
    const innerWidth = window.top?.innerWidth ?? window.innerWidth
    const vw = `${(left / innerWidth) * 100}vw`
    set({ viewerSetting: { ...get().viewerSetting, width: vw } })
    window.top?.document.documentElement.style.setProperty(
      '--mhtml-view-container-width',
      vw
    )
  },
  toggleHighlightMode() {
    const viewerSetting = get().viewerSetting
    set({
      viewerSetting: {
        ...viewerSetting,
        highlightMode: !viewerSetting.highlightMode
      }
    })
  },
  isHighlightActive() {
    return get().viewerSetting.highlightMode
  },
  async createParser(mhtml?: string | ArrayBuffer) {
    if (!mhtml) return

    const parser = new Parser({
      rewriteFn(url: string, part: any) {
        const blob = new Blob([part.body], { type: part.type })
        ;(part as any)._blob = blob
        return URL.createObjectURL(blob)
      }
    })

    return new Promise<Parser | undefined>((resolve, reject) => {
      setTimeout(() => {
        try {
          parser.parse(mhtml as any)
          parser.rewrite()
        } catch (e) {
          reject(e)
          return
        }

        set({ parser })
        resolve(parser)
      })
    })
  },
  async addMark(mark: Mark) {
    const { pageName, marks } = get()

    const id = await logseq.Editor.newBlockUUID()
    mark.id = id
    mark.position.uid = id
    const block = await logseq.Editor.appendBlockInPage(
      pageName,
      mark.position.text,
      { properties: { id } }
    )
    if (!block) return ''

    set({ marks: marks.concat(mark) })
    return mark.id
  },
  async removeMark(id: string) {
    const marks = get().marks
    const mark = marks.find((item) => item.id === id)
    if (!mark) return

    await logseq.Editor.removeBlock(id)

    set({ marks: marks.filter((item) => item.id !== id) })
  },
  updateMark(id, content: EditorContent) {
    const marks = get().marks
    set({
      marks: marks.map((item) => {
        if (item.id === id) {
          const filtered = Object.fromEntries(
            Object.entries(content).filter(([, val]) => val !== undefined)
          )
          return { ...item, ...filtered }
        }
        return item
      })
    })
  },
  persistConfig() {
    // persist pageName and marks to file
    const { pageName, marks } = get()
    return persistToStorage(pageName, marks)
  },
  getMark(id: string) {
    const marks = get().marks
    return marks.find((item) => item.id === id)
  },
  async openFile(fileName: string, content: string | ArrayBuffer) {
    set({ fileName, content, visible: true })
  },
  close() {
    set({ viewerSetting: { ...get().viewerSetting, highlightMode: false } })
    closeMhtmlFile()
  },
  async gotoAnnotationPage() {
    const { pageName } = get()
    const page = await logseq.Editor.getPage(pageName)
    if (!page) return

    await logseq.Editor.scrollToBlockInPage(pageName, page.uuid)
  }
}))
