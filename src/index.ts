import Vue, { VNode, VueConstructor } from 'vue'
import { Store } from 'vuex'
import BureauForm from './components/BureauForm'
import { bureauModule, RootState } from './state'
import { error } from './utilities/logging'

declare global {
  interface Window {
    Vue: VueConstructor
  }

  interface HTMLCollection {
    [Symbol.iterator](): IterableIterator<Element>
  }

  interface Element {
    getElementsByClassName(classNames: string): NodeListOf<HTMLElement>
  }

  namespace JSX {
    type Element = VNode
    type ElementClass = Vue
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

export interface BureauPluginOptions {
  store: Store<RootState>
}

class Bureau {
  static install (vue: VueConstructor, args?: BureauPluginOptions): void { 
    const options = { 
      store: undefined,
      ...args 
    }

    if (!options.store) {
      error('Bureau requires a Vuex store instance to be passed in the plugin options.')
      return
    }

    vue.component('BureauForm', BureauForm)

    options.store.registerModule('bureau', bureauModule, {
      preserveState: Boolean(options.store.state.bureau)
    })
  }
}

export default Bureau

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Bureau)
}
