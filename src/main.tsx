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

  if (!import.meta.env.VITE_IS_MOCK) {
    const createModel = () => {
      return {
        openMhtmlFile
      }
    }

    logseq.Editor.registerSlashCommand('import mhtml/html', importFile)

    logseq.App.onMacroRendererSlotted(({ slot, payload }) => {
      const [type, fileName] = payload.arguments
      console.log('slot renderer', payload.arguments)
      if (type !== ':mhtml') return

      return logseq.provideUI({
        key: fileName,
        slot,
        template: `<a data-filename="${fileName}" data-on-click="openMhtmlFile">${fileName}</a>`,
        reset: true
      })
    })

    logseq.provideModel(createModel())
    logseq.setMainUIInlineStyle({
      zIndex: 100
    })

    logseq.provideStyle(provideStyle)

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
