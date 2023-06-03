import '@logseq/libs'

import React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './style/index.scss'
import provideStyle from './style/provide.scss?inline'

import { logseq as PL } from '../package.json'
import { importFile, openMhtmlFile, startSetup } from './utils'
import { useViewerStore } from './store/viewer'

// @ts-expect-error
const css = (t, ...args) => String.raw(t, ...args)

const pluginId = PL.id

function main() {
  // create portal element in logseq
  // register macro and block renderer

  // startup setting
  // - register macros
  // - block renderer

  console.log(import.meta.env.VITE_IS_MOCK)

  if (!import.meta.env.VITE_IS_MOCK) {
    const createModel = () => {
      return {
        openMhtmlFile
      }
    }

    logseq.Editor.registerSlashCommand('import mhtml', importFile)

    logseq.App.onMacroRendererSlotted(({ slot, payload }) => {
      const [type, fileName] = payload.arguments
      console.log('slot renderer', payload.arguments)
      if (type !== ':mhtml') return

      return logseq.provideUI({
        key: fileName,
        slot,
        template: `<a data-filename="${fileName}" data-on-click="openMhtmlFile">${fileName}</a>`
      })
    })

    logseq.provideModel(createModel())
    logseq.setMainUIInlineStyle({
      zIndex: 100
    })

    logseq.provideStyle(provideStyle)

    // const openIconName = 'mthml'
    //
    // logseq.provideStyle(css`
    //   .${openIconName} {
    //     opacity: 0.55;
    //     font-size: 20px;
    //     margin-top: 4px;
    //   }
    //
    //   .${openIconName}:hover {
    //     opacity: 0.9;
    //   }
    // `)
    //
    //
    // logseq.App.registerUIItem('toolbar', {
    //   key: openIconName,
    //   template: `
    //     <div data-on-click="show" class="${openIconName}">⚙️</div>
    //   `
    // })

    startSetup()
  } else {
    const style = document.createElement('style')
    style.innerHTML = provideStyle
    document.head.appendChild(style)
    useViewerStore.setState({ visible: true })
  }

  const root = ReactDOM.createRoot(document.getElementById('app')!)

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

if (import.meta.env.VITE_IS_MOCK) {
  main()
} else {
  logseq.ready(main).catch(console.error)
}
