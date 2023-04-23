import Parser from '@monsterlee/fast-mhtml'
import { create } from 'zustand'
import {Marker} from "@notelix/web-marker"

interface Mark {
  annotation: string;
}

interface ViewerSetting {
  scale: string;
  width: string;
}

interface ViewerState {
  viewerSetting: ViewerSetting;
  fileName: string;
  marks: Mark[];
  parser?: Parser;
  marker?: Marker;

  setViewerWidth: (left: number) => void;
  createParser: (mhtml?: string | ArrayBuffer) => Promise<Parser | undefined>;
}

export const useViewerStore = create<ViewerState>()((set, get) => ({
  viewerSetting: {
    scale: '100%',
    width: '50vw',
  },
  fileName: '',
  marks: [],

  setViewerWidth(left: number) {
    const innerWidth = window.top?.innerWidth ?? window.innerWidth
    const vw = `${left / innerWidth * 100}vw`
    set({ viewerSetting: {...get().viewerSetting, width: vw} })
    window.top?.document.documentElement.style.setProperty('--mhtml-view-container-width', vw)
  },
  async createParser(mhtml?: string | ArrayBuffer) {
    if (!mhtml) return;

    const parser = new Parser({
      rewriteFn(url: string, part: any) {
        let blob = new Blob([part.body], { type: part.type })
        ;(part as any)._blob = blob
        return URL.createObjectURL(blob)
      }
    })

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        parser.parse(mhtml as any)
        parser.rewrite()

        set({ parser })
        resolve(parser)
      })
    })
  }
}))

