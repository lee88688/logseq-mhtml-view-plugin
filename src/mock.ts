class MockLogseq extends EventTarget {
  isMainUIVisible = true
  on = this.addEventListener
  off = this.removeEventListener
  App: any

  constructor() {
    super()

    this.App = {
      registerUIItem() {}
    }
  }

  ready(cb: () => void) {
    cb()
    return Promise.resolve()
  }

  showMainUI() {}
  hideMainUI() {}
  provideModel() {}
  setMainUIInlineStyle() {}
  provideStyle() {}
}

if (!window.logseq) {
  window.logseq = new MockLogseq();
}

export {}