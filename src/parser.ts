import MhtmlParser from '@monsterlee/fast-mhtml'

export interface Parser {
  parser: unknown;
  destroy: () => void;
  getUrl: () => string;
}

export function createMhtmlParser(mhtml: string | ArrayBuffer) {
  const mhtmlParser = new MhtmlParser({
    rewriteFn(url: string, part: any) {
      const blob = new Blob([part.body], { type: part.type })
      ;(part as any)._blob = blob
      return URL.createObjectURL(blob)
    }
  })

  return new Promise<Parser>((resolve, reject) => {
    setTimeout(() => {
      try {
        mhtmlParser.parse(mhtml as any)
        mhtmlParser.rewrite()
      } catch (e) {
        reject(e)
        return
      }

      const parser: Parser = {
        parser: mhtmlParser,
        destroy: () => {
          for (const part of mhtmlParser.parts) {
            part.rewriteLocation && URL.revokeObjectURL(part.rewriteLocation)
          }
        },
        getUrl: () => {
          return mhtmlParser && mhtmlParser.parts && mhtmlParser.parts[0].rewriteLocation
        }
      }

      resolve(parser)
    })
  })
}

export function createHtmlParser(html: string | ArrayBuffer) {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))

  const parser: Parser = {
    destroy: () => {
      URL.revokeObjectURL(url)
    },
    getUrl: () => url
  }

  return Promise.resolve(parser)
}